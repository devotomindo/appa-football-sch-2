import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { DaftarAlatLatihanView } from "@/features/daftar-alat-latihan/components/view/daftar-alat-latihan-view";
import { getAllLatihanIndividuQueryOptions } from "@/features/daftar-latihan/actions/get-all-latihan-individu/query-options";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function DaftarLatihanIndividu() {
  const queryClient = new QueryClient();

  await Promise.allSettled([
    queryClient.prefetchQuery(getAllLatihanIndividuQueryOptions()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardSectionContainer>
        <DaftarAlatLatihanView />
      </DashboardSectionContainer>
    </HydrationBoundary>
  );
}
