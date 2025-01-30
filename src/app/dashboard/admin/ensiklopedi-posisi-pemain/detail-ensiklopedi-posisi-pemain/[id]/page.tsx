import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { getEnsiklopediByIdQueryOptions } from "@/features/ensiklopedi-posisi-pemain/actions/get-ensiklopedi-by-id/query-options";
import { DetailEnsiklopediPosisiPemainView } from "@/features/ensiklopedi-posisi-pemain/components/view/detail-ensiklopedi-posisi-pemain/detail-ensiklopedi-posisi-pemain-view";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function DetailEnsiklopediPosisiPemain({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = new QueryClient();

  queryClient.prefetchQuery(getEnsiklopediByIdQueryOptions(id));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardSectionContainer>
        <DetailEnsiklopediPosisiPemainView id={id} />
      </DashboardSectionContainer>
    </HydrationBoundary>
  );
}
