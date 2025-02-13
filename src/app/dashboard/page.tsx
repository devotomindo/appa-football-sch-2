import { getAssessmentScoresWithStudentIdQueryOptions } from "@/features/assesmen-pemain/components/actions/get-assessment-scores-with-student-id/query-options";
import { getAllLatihanIndividuByStudentIdQueryOptions } from "@/features/daftar-latihan/actions/get-all-latihan-individu/query-options";
import { getBiodataPemainByStudentIdQueryOptions } from "@/features/daftar-pemain/actions/get-biodata-pemain-by-student-id/query-options";
import { getSchoolMemberQuantityQueryOptions } from "@/features/dashboard/actions/get-school-member-quantity/query-options";
import { DashboardView } from "@/features/dashboard/view/dashboard-view";
import { authGuard } from "@/features/user/guards/auth-guard";
import { getSchoolSession } from "@/lib/session";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  // AUTH GUARD
  const authResponse = await authGuard();

  if (!authResponse.success || !authResponse.data) {
    return redirect("/");
  }

  const userData = authResponse.data;
  // END OF AUTH GUARD

  const schoolSession = await getSchoolSession();

  const queryClient = new QueryClient();

  await Promise.allSettled([
    schoolSession
      ? queryClient.prefetchQuery(
          getSchoolMemberQuantityQueryOptions(schoolSession?.id),
        )
      : Promise.resolve(),
    queryClient.prefetchQuery(
      getBiodataPemainByStudentIdQueryOptions(
        userData?.schools?.[0]?.studentId,
      ),
    ),
    queryClient.prefetchQuery(
      getAllLatihanIndividuByStudentIdQueryOptions(
        userData?.schools?.[0]?.studentId,
      ),
    ),
    queryClient.prefetchQuery(
      getAssessmentScoresWithStudentIdQueryOptions(
        userData?.schools?.[0]?.studentId,
      ),
    ),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardView userData={userData} initialSchoolSession={schoolSession} />
    </HydrationBoundary>
  );
}
