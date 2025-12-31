import {
  SignIn,
  SignedIn,
  SignedOut,
  RedirectToUserProfile,
} from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <>
      <SignedOut>
        <SignIn />
      </SignedOut>

      <SignedIn>
        <RedirectToUserProfile />
      </SignedIn>
    </>
  );
}
