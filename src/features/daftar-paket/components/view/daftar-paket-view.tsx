"use client";

import { formatRupiah } from "@/lib/utils/format-rupiah";
import { getDefautTableOptions } from "@/lib/utils/mantine-react-table";
import { Button, Modal } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from "mantine-react-table";
import { useMemo, useState } from "react";
// import type { GetAllPackagesResponse } from "../actions/get-all-daftar-paket";
// import { getAllPackagesQueryOptions } from "../actions/get-all-daftar-paket/query-options";
// import { CreatePaketForm } from "../components/forms/create-paket-form";
import { GetAllPackagesResponse } from "../../actions/get-all-daftar-paket";
import { getAllPackagesQueryOptions } from "../../actions/get-all-daftar-paket/query-options";
import { CreatePaketForm } from "../forms/create-paket-form";

export function DaftarPaketView() {
  // QUERY DATA
  const packagesQuery = useQuery(getAllPackagesQueryOptions());

  // State Definitions
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = useMemo<MRT_ColumnDef<GetAllPackagesResponse[number]>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Nama Paket",
        filterFn: "contains",
      },
      {
        accessorKey: "description",
        header: "Deskripsi",
        filterFn: "contains",
      },
      {
        accessorKey: "monthDuration",
        header: "Durasi (Bulan)",
        filterFn: "contains",
      },
      {
        accessorKey: "quotaAddition",
        header: "Tambahan Kuota",
        filterFn: "contains",
      },
      {
        accessorFn: (row) => formatRupiah(Number(row.price)),
        id: "price",
        header: "Harga",
        filterFn: "contains",
      },
      {
        accessorFn: (row) =>
          dayjs(row.createdAt).format("DD/MM/YYYY, HH:mm:ss"),
        id: "createdAt",
        header: "Dibuat",
        filterVariant: "date-range",
      },
    ],
    [],
  );

  const table = useMantineReactTable({
    ...getDefautTableOptions({
      queryResult: packagesQuery,
    }),
    columns,
    enableRowNumbers: true,
    rowNumberDisplayMode: "original",
    data: packagesQuery.data ?? [],
  });

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Daftar Paket</h1>
      <div className="flex justify-end">
        <Button
          onClick={() => setIsModalOpen(true)}
          leftSection={<IconPlus />}
          color="green"
        >
          Buat Paket
        </Button>
      </div>

      <Modal
        opened={isModalOpen}
        title="Buat Paket Baru"
        onClose={() => setIsModalOpen(false)}
        centered
      >
        <CreatePaketForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>

      <MantineReactTable table={table} />
    </section>
  );
}
