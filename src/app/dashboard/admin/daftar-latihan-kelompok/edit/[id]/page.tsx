import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { EditLatihanKelompokView } from "@/features/daftar-latihan-kelompok/components/view/edit-latihan-kelompok-view";
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
        <EditLatihanKelompokView latihanId={id} />
      </DashboardSectionContainer>
    </HydrationBoundary>
  );
}
