import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { getAssessmentByIdQueryOptions } from "@/features/data-asesmen/actions/get-assesment-by-id/query-options";
import { DetailAsesmenView } from "@/features/data-asesmen/components/view/detail-asesmen-view/detail-asesmen-view";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function DetailAsesmen({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(getAssessmentByIdQueryOptions(id));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardSectionContainer>
        <DetailAsesmenView id={id} />
      </DashboardSectionContainer>
    </HydrationBoundary>
  );
}
