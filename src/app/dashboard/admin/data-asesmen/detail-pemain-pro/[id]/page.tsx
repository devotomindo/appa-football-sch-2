import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { getAllProPlayerAssessmentByIdQueryOptions } from "@/features/data-asesmen/actions/get-all-pro-player-assessment-by-id/query-options";
import { getProPlayerByIdQueryOptions } from "@/features/data-asesmen/actions/get-pro-player-by-id/query-options";
import { DetailPemainProView } from "@/features/data-asesmen/components/view/detail-pemain-pro-view/detail-pemain-pro-view";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function DetailPemainPro({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await Promise.allSettled([
    await queryClient.prefetchQuery(getProPlayerByIdQueryOptions(id)),
    await queryClient.prefetchQuery(
      getAllProPlayerAssessmentByIdQueryOptions(id),
    ),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardSectionContainer>
        <DetailPemainProView id={id} />
      </DashboardSectionContainer>
    </HydrationBoundary>
  );
}
