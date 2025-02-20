import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { getAllEnsiklopediPemainQueryOptions } from "@/features/ensiklopedi-posisi-pemain/actions/get-all-ensiklopedi-pemain/query-options";
import { EnsiklopediPosisiPemainView } from "@/features/ensiklopedi-posisi-pemain/components/view/ensiklopedi-posisi-pemain-view";
import { authGuard } from "@/features/user/guards/auth-guard";
import { isUserAdmin } from "@/features/user/utils/is-user-admin";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default async function EnsiklopediPosisiPemain() {
  const queryClient = new QueryClient();

  const authResponse = await authGuard();

  if (!authResponse.success || !authResponse.data) {
    return redirect("/");
  }

  const userData = authResponse.data;

  const isAdmin = isUserAdmin(userData);

  await Promise.allSettled([
    queryClient.prefetchQuery(getAllEnsiklopediPemainQueryOptions()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardSectionContainer>
        <EnsiklopediPosisiPemainView isAdmin={isAdmin} />
      </DashboardSectionContainer>
    </HydrationBoundary>
  );
}
