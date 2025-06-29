import { SignUp } from "@clerk/nextjs";

export default function SingUpPage() {
  return <SignUp forceRedirectUrl="/new-user" />;
}
