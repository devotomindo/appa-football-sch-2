import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { getAllReferralsQueryOptions } from "@/features/referrals/actions/get-all-referrals/query-options";
import { ReferralsAdminView } from "@/features/referrals/components/view/referrals-admin-view";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function ReferralsPage() {
  const queryClient = new QueryClient();

  await Promise.allSettled([
    queryClient.prefetchQuery(getAllReferralsQueryOptions()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardSectionContainer>
        <ReferralsAdminView />
      </DashboardSectionContainer>
    </HydrationBoundary>
  );
}
