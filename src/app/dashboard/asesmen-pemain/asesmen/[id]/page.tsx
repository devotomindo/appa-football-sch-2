import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { getAssessmentByIdQueryOptions } from "@/features/data-asesmen/actions/get-assesment-by-id/query-options";
import { AssessmentCoachView } from "@/features/data-asesmen/components/view/assessment-coach-view";
import { getSchoolSession } from "@/lib/session";
import { getQueryClient } from "@/lib/tanstack-query/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function AsesmenDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(getAssessmentByIdQueryOptions(id)),
  ]);

  const schoolSession = await getSchoolSession();

  if (!schoolSession) {
    return null;
  }

  return (
    <DashboardSectionContainer>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AssessmentCoachView id={id} schoolSession={schoolSession} />
      </HydrationBoundary>
    </DashboardSectionContainer>
  );
}
