import { SignUpForm } from "@/features/user/components/form/sign-up-form";
import { authGuard } from "@/features/user/guards/auth-guard";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const authResponse = await authGuard();

  if (authResponse.success || authResponse.data) {
    return redirect("/dashboard");
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-black py-20 text-white">
      <SignUpForm />
      <div className="absolute left-0 top-0 h-full w-1/2 overflow-hidden">
        <div className="relative flex h-full w-full flex-col justify-center">
          <Image
            src={"/logo-tanpa-teks.png"}
            alt=""
            width={500}
            height={500}
            className="z-0 h-[85%] -translate-x-1/2 transform opacity-20"
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
    </div>
  );
}
