import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { getAllLatihanKelompokQueryOptions } from "@/features/daftar-latihan-kelompok/actions/get-all-latihan-kelompok/query-options";
import { DaftarLatihanKelompokView } from "@/features/daftar-latihan-kelompok/components/view/daftar-latihan-kelompok-view";
import { authGuard } from "@/features/user/guards/auth-guard";
import { isUserAdmin } from "@/features/user/utils/is-user-admin";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default async function DaftarLatihanKelompok() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(getAllLatihanKelompokQueryOptions());

  const authResponse = await authGuard();

  if (!authResponse.success || !authResponse.data) {
    return redirect("/");
  }

  const userData = authResponse.data;

  const isAdmin = isUserAdmin(userData);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardSectionContainer>
        <DaftarLatihanKelompokView isAdmin={isAdmin} />
      </DashboardSectionContainer>
    </HydrationBoundary>
  );
}
