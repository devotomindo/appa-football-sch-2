import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { getAllPackagesQueryOptions } from "@/features/daftar-paket/actions/get-all-daftar-paket/query-options";
import { DaftarPaketView } from "@/features/daftar-paket/components/view/daftar-paket-view";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function DaftarPaketPage() {
  const queryClient = new QueryClient();

  await Promise.allSettled([
    queryClient.prefetchQuery(getAllPackagesQueryOptions()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardSectionContainer>
        <DaftarPaketView />
      </DashboardSectionContainer>
    </HydrationBoundary>
  );
}
