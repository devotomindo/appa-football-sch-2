import { AsesmenPemainView } from "@/features/assesmen-pemain/components/view/assesmen-pemain-view";
import { getAllAssessmentCategoriesQueryOptions } from "@/features/data-asesmen/actions/get-all-assessment-categories/query-options";
import { getSchoolSession } from "@/lib/session";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function AsesmenPemain() {
  // AUTH GUARD
  // const authResponse = await authGuard();

  // if (!authResponse.success || !authResponse.data) {
  //   return redirect("/");
  // }

  // const userData = authResponse.data;
  // END OF AUTH GUARD

  const schoolSession = await getSchoolSession();

  const queryClient = new QueryClient();

  await Promise.allSettled([
    queryClient.prefetchQuery(getAllAssessmentCategoriesQueryOptions()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AsesmenPemainView initialSchoolSession={schoolSession} />
    </HydrationBoundary>
  );
}
