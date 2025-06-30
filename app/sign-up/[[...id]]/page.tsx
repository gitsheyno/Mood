import { SignUp } from "@clerk/nextjs";

export default function SingUpPage() {
  console.log("Environment variables:", {
    signUp: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    signUpForceRedirect:
      process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL,
    signInForceRedirect:
      process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL,
  });
  return <SignUp />;
}
