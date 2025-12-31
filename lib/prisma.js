/*Now your Next.js app needs a way to talk to that database.
Just like:
You have a phone (database)
You need a SIM card (Prisma Client) to talk to it
Prisma Client = your app’s SIM card // the tool that allows you to talk to your database from JavaScript/Node.
NeonDB = your real database
This makes your app able to talk to NeonDB.

That's it.
Not a new database.
Not new tables.
Not duplication.

Just a connection.

golbalThis - Create a new instance
------------------------------------------------------------------------------------------------------------------
//🛠️ prisma generate = makes your tools
🧱 prisma migrate = actually builds the house

-------------------------------------------------
1. NODE_ENV="development"

You are coding on your laptop ,Next.js enables fast refresh ,Prisma shows extra logs,Errors are more detailed

2️⃣ NODE_ENV="production"

Your app is deployed (Vercel, AWS, etc.),Runs faster,Removes development tools,Hides detailed error messages

3️⃣ NODE_ENV="test"

Used only for testing libraries*/

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis;

// create adapter with your DATABASE_URL // 
// This adapter tells Prisma: “Which type of database am I connecting to?”
const adapter = new PrismaPg({
  // use DATABASE_URL from env (ensure .env exists at project root)
  connectionString: process.env.DATABASE_URL,
});

// construct PrismaClient with the adapter which means Use already-existing client if it exists
// Else create a new PrismaClient USING the adapter

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,           // <- required in Prisma 7
    log: ["query"],    // optional
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

