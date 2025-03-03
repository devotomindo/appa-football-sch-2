"use client";

import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { getDefautTableOptions } from "@/lib/utils/mantine-react-table";
import { Badge } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from "mantine-react-table";
import { useMemo } from "react";
import { GetCurrentUserTransactionsResponse } from "../../action/get-current-user-transactions";
import { getCurrentUserTransactionsQueryOptions } from "../../action/get-current-user-transactions/query-options";

export function RiwayatTransaksiView() {
  // QUERY DATA
  const transactionsQuery = useQuery(getCurrentUserTransactionsQueryOptions());

  const columns = useMemo<
    MRT_ColumnDef<GetCurrentUserTransactionsResponse[number]>[]
  >(
    () => [
      {
        accessorKey: "packageName",
        header: "Paket",
        filterFn: "contains",
      },
      {
        accessorKey: "schoolName",
        header: "SSB",
        filterFn: "contains",
      },
      {
        accessorKey: "billedAmount",
        header: "Nominal",
        Cell: ({ row }) => (
          <span>
            Rp{" "}
            {new Intl.NumberFormat("id-ID").format(row.original.billedAmount)}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        Cell: ({ row }) => (
          <Badge
            color={
              row.original.status === "success" ||
              row.original.status === "settlement"
                ? "green"
                : row.original.status === "pending"
                  ? "yellow"
                  : row.original.status === "initiated"
                    ? "blue"
                    : "red"
            }
          >
            {row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: "paymentMethod",
        header: "Metode Pembayaran",
      },
      {
        accessorKey: "referralCode",
        header: "Kode Referral",
      },
      {
        accessorFn: (row) =>
          row.createdAt
            ? dayjs(row.createdAt).format("DD/MM/YYYY, HH:mm:ss")
            : "-",
        id: "createdAt",
        header: "Created At",
        filterVariant: "date-range",
      },
      {
        accessorFn: (row) =>
          row.updatedAt
            ? dayjs(row.updatedAt).format("DD/MM/YYYY, HH:mm:ss")
            : "-",
        id: "updatedAt",
        header: "Updated At",
        filterVariant: "date-range",
      },
    ],
    [],
  );

  const table = useMantineReactTable({
    ...getDefautTableOptions({
      queryResult: transactionsQuery,
    }),
    columns,
    enableRowNumbers: true,
    rowNumberDisplayMode: "original",
    data: transactionsQuery.data ?? [],
  });

  return (
    <DashboardSectionContainer>
      <h1 className="mb-5 text-2xl font-bold">Riwayat Transaksi</h1>
      <MantineReactTable table={table} />
    </DashboardSectionContainer>
  );
}
