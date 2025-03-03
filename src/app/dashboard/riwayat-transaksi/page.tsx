import { getCurrentUserTransactionsQueryOptions } from "@/features/transactions/action/get-current-user-transactions/query-options";
import { RiwayatTransaksiView } from "@/features/transactions/components/view/riwayat-transaksi-view";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function RiwayatTransaksiPage() {
  // // AUTH GUARD
  // const authResponse = await authGuard();

  // if (!authResponse.success || !authResponse.data) {
  //   return redirect("/");
  // }

  // const userData = authResponse.data;
  // // END OF AUTH GUARD

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(getCurrentUserTransactionsQueryOptions()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RiwayatTransaksiView />
    </HydrationBoundary>
  );
}
