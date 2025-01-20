import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { getAllLatihanKelompokQueryOptions } from "@/features/daftar-latihan-kelompok/actions/get-all-latihan-kelompok/query-options";
import { DaftarLatihanKelompokView } from "@/features/daftar-latihan-kelompok/components/view/daftar-latihan-kelompok-view";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function DaftarLatihanKelompok() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(getAllLatihanKelompokQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardSectionContainer>
        <DaftarLatihanKelompokView />
      </DashboardSectionContainer>
    </HydrationBoundary>
  );
}
