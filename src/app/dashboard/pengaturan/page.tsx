import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
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
    <DashboardSectionContainer>
      <h1 className="text-2xl font-bold">Pengaturan Profil</h1>
      <UserProfileUpdateForm userData={userData} />
    </DashboardSectionContainer>
  );
}
