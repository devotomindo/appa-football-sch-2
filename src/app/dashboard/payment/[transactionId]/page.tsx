import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { getTransactionByIdQueryOptions } from "@/features/transactions/action/get-transaction-by-id/query-options";
import { PaymentView } from "@/features/transactions/components/view/payment-view";
import { getQueryClient } from "@/lib/tanstack-query/get-query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import Script from "next/script";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ transactionId: string }>;
}) {
  const transactionId = (await params).transactionId;

  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery(getTransactionByIdQueryOptions(transactionId)),
  ]);

  return (
    <DashboardSectionContainer>
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js" // Sandbox
        // src="https://app.midtrans.com/snap/snap.js" // Production
        data-client-key={process.env.MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      ></Script>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PaymentView transactionId={transactionId} />
      </HydrationBoundary>
    </DashboardSectionContainer>
  );
}
