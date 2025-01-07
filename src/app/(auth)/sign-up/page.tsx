import { SignUpForm } from "@/features/user/components/form/sign-up-form";
import { authGuard } from "@/features/user/guards/auth-guard";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const authResponse = await authGuard();

  if (authResponse.success || authResponse.data) {
    return redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Sign Up</h1>
      <SignUpForm />
    </div>
  );
}
