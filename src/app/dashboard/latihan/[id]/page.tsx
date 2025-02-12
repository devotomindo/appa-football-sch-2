import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { DetailLatihanView } from "@/features/daftar-latihan-kelompok/components/view/detail-latihan-kelompok-view";
import { authGuard } from "@/features/user/guards/auth-guard";
import { isUserAdmin } from "@/features/user/utils/is-user-admin";
import { redirect } from "next/navigation";

export default async function DetailLatihanPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  // AUTH GUARD
  const authResponse = await authGuard();

  if (!authResponse.success || !authResponse.data) {
    return redirect("/");
  }

  const userData = authResponse.data;
  // END OF AUTH GUARD

  const isAdmin = isUserAdmin(userData);

  return (
    <DashboardSectionContainer>
      <DetailLatihanView
        latihanId={id}
        isAdmin={isAdmin}
        roles={userData.schools[0].role.toLowerCase()}
      />
    </DashboardSectionContainer>
  );
}
