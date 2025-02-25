"use client";

import { Stack } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getTransactionByIdQueryOptions } from "../../action/get-transaction-by-id/query-options";
import { useSnapPayment } from "../../hooks/use-snap-payment";

export function PaymentView({ transactionId }: { transactionId: string }) {
  const transactionQuery = useQuery(
    getTransactionByIdQueryOptions(transactionId),
  );

  const transactionData = transactionQuery.data;
  const snapContainerRef = useSnapPayment(
    transactionId,
    transactionData?.midtransToken,
  );

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Order Details</h1>
      <div className="flex justify-between">
        <Stack>
          <div>
            <div className="mb-2 text-sm font-semibold text-gray-600">
              Nama Pengguna
            </div>
            <div>{transactionData?.buyerName}</div>
          </div>

          <div>
            <div className="mb-2 text-sm font-semibold text-gray-600">
              Nama Sekolah
            </div>
            <div>{transactionData?.schoolName}</div>
          </div>

          <div>
            <div className="mb-2 text-sm font-semibold text-gray-600">
              Tambahan Kuota Pemain
            </div>
            <div>{transactionData?.packageQuotaAdded} Pemain</div>
          </div>

          <div>
            <div className="mb-2 text-sm font-semibold text-gray-600">
              Masa Berlaku
            </div>
            <div>{transactionData?.packageDuration} Bulan</div>
          </div>
        </Stack>
        <div ref={snapContainerRef} className="min-w-[300px]" />
      </div>
    </div>
  );
}
