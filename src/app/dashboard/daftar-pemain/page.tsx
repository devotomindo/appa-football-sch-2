import { DaftarPemainView } from "@/features/daftar-pemain/view/daftar-pemain-view";
import { getActiveTransactionsBySchoolIdQueryOptions } from "@/features/school/action/get-active-transactions-by-school-id/query-options";
import { getAllStudentsBySchoolIdQueryOptions } from "@/features/school/action/get-all-students-by-school-id/query-options";
import { getPremiumQuotaBySchoolIdQueryOptions } from "@/features/school/action/get-premium-quota-by-school-id/query-options";
import { authGuard } from "@/features/user/guards/auth-guard";
import { getSchoolSession } from "@/lib/session";
import { getQueryClient } from "@/lib/tanstack-query/get-query-client";
import { redirect } from "next/navigation";

export default async function DaftarPemainPage() {
  // AUTH GUARD
  const authResponse = await authGuard();

  if (!authResponse.success || !authResponse.data) {
    return redirect("/");
  }

  const userData = authResponse.data;
  // END OF AUTH GUARD

  const schoolSession = await getSchoolSession();

  const queryClient = getQueryClient();

  // Prefetch the data
  await Promise.all([
    queryClient.prefetchQuery(
      getAllStudentsBySchoolIdQueryOptions(schoolSession?.id ?? ""),
    ),
    queryClient.prefetchQuery(
      getPremiumQuotaBySchoolIdQueryOptions(schoolSession?.id ?? ""),
    ),
    queryClient.prefetchQuery(
      getActiveTransactionsBySchoolIdQueryOptions(schoolSession?.id ?? ""),
    ),
  ]);

  return (
    <DaftarPemainView
      userData={userData}
      initialSchoolSession={schoolSession}
    />
  );
}
