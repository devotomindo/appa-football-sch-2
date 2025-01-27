import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { getAllAssesmentQueryOptions } from "@/features/data-asesmen/actions/get-all-assesment/query-options";
import { getAllProPlayersQueryOptions } from "@/features/data-asesmen/actions/get-all-pro-players/query-options";
import { DataAsesmenView } from "@/features/data-asesmen/components/view/data-asesmen-view";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function DataAsesmen() {
  const queryClient = new QueryClient();

  await Promise.allSettled([
    queryClient.prefetchQuery(getAllAssesmentQueryOptions()),
    queryClient.prefetchQuery(getAllProPlayersQueryOptions()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardSectionContainer>
        <DataAsesmenView />
      </DashboardSectionContainer>
    </HydrationBoundary>
  );
}
