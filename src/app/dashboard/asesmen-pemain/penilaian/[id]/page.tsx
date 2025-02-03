import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { getPenilaianByIdQueryOptions } from "@/features/data-asesmen/actions/get-penilaian-by-id/query-options";
import { PenilaianCoachView } from "@/features/data-asesmen/components/view/penilaian-coach-view";
import { getQueryClient } from "@/lib/tanstack-query/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function PenilaianDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(getPenilaianByIdQueryOptions(id)),
  ]);

  return (
    <DashboardSectionContainer>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PenilaianCoachView id={id} />
      </HydrationBoundary>
    </DashboardSectionContainer>
  );
}
