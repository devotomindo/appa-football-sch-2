import { UserProfileUpdateForm } from "@/features/user/components/form/user-profile-update-form";
import { authGuard } from "@/features/user/guards/auth-guard";
import { redirect } from "next/navigation";

export default async function PengaturanPage() {
  // AUTH GUARD
  const authResponse = await authGuard();

  if (!authResponse.success || !authResponse.data) {
    return redirect("/");
  }

  const userData = authResponse.data;
  // END OF AUTH GUARD

  return (
    <div>
      <UserProfileUpdateForm userData={userData} />
    </div>
  );
}
