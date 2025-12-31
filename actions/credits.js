"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";


/**
 * Credits per plan
 */
const PLAN_CREDITS = {
  free_user: 0,     // No credits
  standard: 10,     // 10 credits per month
  premium: 24,      // 24 credits per month
};

// Each appointment costs 2 credits
const APPOINTMENT_CREDIT_COST = 2;

/**
 * Check user's plan and allocate credits if needed
 */
export async function checkAndAllocateCredits(serverUser) {
  try {
    // Safety checks
    if (!serverUser) return null;
    if (serverUser.role !== "PATIENT") return serverUser;

    // Get Clerk auth info
    //auth() gets the currently logged-in user’s authentication info from Clerk (on the server).
    //has() checks whether the logged-in user has a specific plan/permission (like free, standard, premium).

    const { has } = await auth();

    // Detect plan
    const hasFree = has({ plan: "free_user" });
    const hasStandard = has({ plan: "standard" });
    const hasPremium = has({ plan: "premium" });

    let currentPlan = "null";
    let creditsToAllocate = 0;

    if (hasPremium) {
      currentPlan = "premium";
      creditsToAllocate = PLAN_CREDITS.premium;
    } else if (hasStandard) {
      currentPlan = "standard";
      creditsToAllocate = PLAN_CREDITS.standard;
    } else if (hasFree) {
      currentPlan = "free_user";
      creditsToAllocate = PLAN_CREDITS.free_user;
    }

    /**
     * IMPORTANT:
     * Here we ONLY decide plan & credits.
     * DB update will be added later.
     */

    if (!currentPlan) {
      return serverUser;
    }

    // Check if we already allocated credits for this month
    const currentMonth = format(new Date(), "yyyy-MM");

    // If there's a transaction this month, check if it's for the same plan
    // ? makes it optional , avoid crash for new user 
    if (serverUser.transactions?.length > 0) {
        //“Give me the MOST RECENT transaction of this user”
      const latestTransaction = serverUser.transactions[0];
      const transactionMonth = format(
        new Date(latestTransaction.createdAt),
        "yyyy-MM"
      );
      const transactionPlan = latestTransaction.packageId;

      // If we already allocated credits for this month and the plan is the same, just return
      if (
        transactionMonth === currentMonth &&
        transactionPlan === currentPlan
      ) {
        return serverUser;
      }
    }
    const updatedUser = await db.$transaction(async (tx) => {
      // Create transaction record
      await tx.creditTransaction.create({
        data: {
          userId: serverUser.id,
          amount: creditsToAllocate,
          type: "CREDIT_PURCHASE",
          packageId: currentPlan,
        },
      });

      // Update user's credit balance
      const updatedUser = await tx.user.update({
        where: {
          id: serverUser.id,
        },
        data: {
          credits: {
            increment: creditsToAllocate,
          },
        },
      });

      return updatedUser;
    });

    // Revalidate relevant paths to reflect updated credit balance
    revalidatePath("/doctors");
    revalidatePath("/appointments");

    return updatedUser;

  } catch (error) { 
    console.error(
      "Failed to check subscription and allocate credits:",
      error.message
    );
    return null;
  }
}

export async function deductCreditsForAppointment(userId, doctorId) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    const doctor = await db.user.findUnique({
      where: { id: doctorId },
    });

    // Ensure user has sufficient credits
    if (user.credits < APPOINTMENT_CREDIT_COST) {
      throw new Error("Insufficient credits to book an appointment");
    }

    if (!doctor) {
      throw new Error("Doctor not found");
    }

    // Deduct credits from patient and add to doctor
    const result = await db.$transaction(async (tx) => {
      // Create transaction record for patient (deduction)
      await tx.creditTransaction.create({
        data: {
          userId: user.id,
          amount: -APPOINTMENT_CREDIT_COST,
          type: "APPOINTMENT_DEDUCTION",
        },
      });

      // Create transaction record for doctor (addition)
      await tx.creditTransaction.create({
        data: {
          userId: doctor.id,
          amount: APPOINTMENT_CREDIT_COST,
          type: "APPOINTMENT_DEDUCTION", // Using same type for consistency
        },
      });

      // Update patient's credit balance (decrement)
      const updatedUser = await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          credits: {
            decrement: APPOINTMENT_CREDIT_COST,
          },
        },
      });

      // Update doctor's credit balance (increment)
      await tx.user.update({
        where: {
          id: doctor.id,
        },
        data: {
          credits: {
            increment: APPOINTMENT_CREDIT_COST,
          },
        },
      });

      return updatedUser;
    });

    return { success: true, user: result };
  } catch (error) {
    console.error("Failed to deduct credits:", error);
    return { success: false, error: error.message };
  }
}
