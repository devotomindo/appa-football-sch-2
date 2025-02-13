import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { EditLatihanIndividuView } from "@/features/daftar-latihan-individu/components/view/edit-latihan-individu-view";
import { getLatihanByIdQueryOptions } from "@/features/daftar-latihan/actions/get-latihan-by-id/query-options";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function EditLatihanKelompok({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await Promise.allSettled([
    queryClient.prefetchQuery(getLatihanByIdQueryOptions(id)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardSectionContainer>
        <EditLatihanIndividuView latihanId={id} />
      </DashboardSectionContainer>
    </HydrationBoundary>
  );
}
