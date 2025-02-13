import { getAllEnsiklopediPemainQueryOptions } from "@/features/ensiklopedi-posisi-pemain/actions/get-all-ensiklopedi-pemain/query-options";
import { EnsiklopediPosisiPemainView } from "@/features/ensiklopedi-posisi-pemain/components/view/ensiklopedi-posisi-pemain-view";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function EnsiklopediPosisiPemain() {
  const queryClient = new QueryClient();

  await Promise.allSettled([
    queryClient.prefetchQuery(getAllEnsiklopediPemainQueryOptions()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EnsiklopediPosisiPemainView isAdmin={false} />
    </HydrationBoundary>
  );
}
