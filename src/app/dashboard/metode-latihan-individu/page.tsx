import { DaftarLatihanIndividuView } from "@/features/daftar-latihan-individu/components/view/daftar-latihan-individu-view";
import { getAllLatihanIndividuQueryOptions } from "@/features/daftar-latihan/actions/get-all-latihan-individu/query-options";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function MetodeLatihanIndividu() {
  const queryClient = new QueryClient();

  await Promise.allSettled([
    queryClient.prefetchQuery(getAllLatihanIndividuQueryOptions()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DaftarLatihanIndividuView isAdmin={false} />
    </HydrationBoundary>
  );
}
