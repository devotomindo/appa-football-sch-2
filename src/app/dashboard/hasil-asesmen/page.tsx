import { getAssessmentScoresOfCurrentAthleteWithSchoolIdQueryOptions } from "@/features/assesmen-pemain/components/actions/get-assessment-scores-of-current-athlete-with-school-id/query-options";
import { HasilAsesmenPemainView } from "@/features/assesmen-pemain/components/view/hasil-asesmen-pemain-view";
import { getSchoolSession } from "@/lib/session";
import { getQueryClient } from "@/lib/tanstack-query/get-query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default async function HasilAsesmen() {
  const schoolSession = await getSchoolSession();

  if (!schoolSession?.id) {
    redirect("/login");
  }

  const queryClient = getQueryClient();

  await Promise.allSettled([
    queryClient.prefetchQuery(
      getAssessmentScoresOfCurrentAthleteWithSchoolIdQueryOptions(
        schoolSession.id,
      ),
    ),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HasilAsesmenPemainView />
    </HydrationBoundary>
  );
}
