"use client";

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
import type { GetAllTransactionsResponse } from "../../action/get-all-transactions";
import { getAllTransactionsQueryOptions } from "../../action/get-all-transactions/query-options";

export function DaftarTransaksiView() {
  // QUERY DATA
  const transactionsQuery = useQuery(getAllTransactionsQueryOptions());

  const columns = useMemo<MRT_ColumnDef<GetAllTransactionsResponse[number]>[]>(
    () => [
      {
        accessorKey: "userName",
        header: "User",
        filterFn: "contains",
      },
      {
        accessorKey: "packageName",
        header: "Package",
        filterFn: "contains",
      },
      {
        accessorKey: "billedAmount",
        header: "Amount",
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
              row.original.status === "PAID"
                ? "green"
                : row.original.status === "PENDING"
                  ? "yellow"
                  : "red"
            }
          >
            {row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: "paymentMethod",
        header: "Payment Method",
      },
      {
        accessorKey: "referralCode",
        header: "Referral Code",
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
    <section>
      <MantineReactTable table={table} />
    </section>
  );
}
