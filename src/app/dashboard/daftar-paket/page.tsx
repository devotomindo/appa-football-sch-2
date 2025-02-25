import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { DaftarPaketBuyerView } from "@/features/daftar-paket/components/view/daftar-paket-buyer-view";
import { authGuard } from "@/features/user/guards/auth-guard";
import { getSchoolSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DaftarPaketPage() {
  // AUTH GUARD
  const authResponse = await authGuard();

  if (!authResponse.success || !authResponse.data) {
    return redirect("/");
  }

  const userData = authResponse.data;
  // END OF AUTH GUARD

  const schoolSession = await getSchoolSession();
  return (
    <DashboardSectionContainer>
      <DaftarPaketBuyerView
        userData={userData}
        initialSchoolSession={schoolSession}
      />
    </DashboardSectionContainer>
  );
}
