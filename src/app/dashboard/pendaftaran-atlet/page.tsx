import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { PendaftaranAtletTable } from "@/features/pendaftaran-atlet/table/pendaftaran-atlet-table";
import { PendaftaranAtletView } from "@/features/pendaftaran-atlet/view/pendaftaran-atlet-view";
import { getUserSchoolsMemberByUserIdQueryOptions } from "@/features/user/actions/get-user-schools-member-by-user-id/query-options";
import { authGuard } from "@/features/user/guards/auth-guard";
import { getQueryClient } from "@/lib/tanstack-query/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default async function PendaftaranAtletPage() {
  // AUTH GUARD
  const authResponse: Awaited<ReturnType<typeof authGuard>> = await authGuard();

  if (!authResponse.success || !authResponse.data) {
    return redirect("/");
  }

  const userData = authResponse.data;
  // END OF AUTH GUARD

  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(
      getUserSchoolsMemberByUserIdQueryOptions(userData.id),
    ),
  ]);

  return (
    <DashboardSectionContainer>
      <PendaftaranAtletView userData={userData} />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PendaftaranAtletTable userId={userData.id} />
      </HydrationBoundary>
    </DashboardSectionContainer>
  );
}
