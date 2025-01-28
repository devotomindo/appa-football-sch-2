import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { DaftarLatihanIndividuView } from "@/features/daftar-latihan-individu/components/view/daftar-latihan-individu-view";
import { authGuard } from "@/features/user/guards/auth-guard";
import { isUserAdmin } from "@/features/user/utils/is-user-admin";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default async function DaftarLatihanIndividu() {
  const queryClient = new QueryClient();

  const authResponse = await authGuard();

  if (!authResponse.success || !authResponse.data) {
    return redirect("/");
  }

  const userData = authResponse.data;

  const isAdmin = isUserAdmin(userData);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardSectionContainer>
        <DaftarLatihanIndividuView isAdmin={isAdmin} />
      </DashboardSectionContainer>
    </HydrationBoundary>
  );
}
