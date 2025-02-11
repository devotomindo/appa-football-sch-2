"use client";

import { formatRupiah } from "@/lib/utils/format-rupiah";
import { getDefautTableOptions } from "@/lib/utils/mantine-react-table";
import { Button, Modal } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from "mantine-react-table";
import { useMemo, useState } from "react";
import { GetAllPackagesResponse } from "../../actions/get-all-daftar-paket";
import { getAllPackagesQueryOptions } from "../../actions/get-all-daftar-paket/query-options";
import { CreateOrUpdatePaketForm } from "../forms/create-or-update-paket-form";
import { DeletePaketForm } from "../forms/delete-paket-form";

export function DaftarPaketView() {
  const packagesQuery = useQuery(getAllPackagesQueryOptions());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPaket, setSelectedPaket] = useState<
    GetAllPackagesResponse[number] | undefined
  >();

  const openDeleteModal = (id: string) =>
    modals.open({
      title: "Hapus Paket",
      centered: true,
      children: <DeletePaketForm paketId={id} />,
    });

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
      {
        header: "Actions",
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              size="xs"
              color="blue"
              onClick={() => {
                setSelectedPaket(row.original);
                setIsModalOpen(true);
              }}
            >
              Edit
            </Button>
            <Button
              size="xs"
              color="red"
              onClick={() => openDeleteModal(row.original.id)}
            >
              Hapus
            </Button>
          </div>
        ),
      },
    ],
    [setSelectedPaket, setIsModalOpen],
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
        title={selectedPaket ? "Update Paket" : "Buat Paket Baru"}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPaket(undefined);
        }}
        centered
      >
        <CreateOrUpdatePaketForm
          paketData={selectedPaket}
          onSuccess={() => {
            setIsModalOpen(false);
            setSelectedPaket(undefined);
          }}
        />
      </Modal>

      <MantineReactTable table={table} />
    </section>
  );
}
