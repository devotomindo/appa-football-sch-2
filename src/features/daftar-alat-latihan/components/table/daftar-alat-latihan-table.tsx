"use client";

import { getDefautTableOptions } from "@/lib/utils/mantine-react-table";
import { Button, Modal } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable,
} from "mantine-react-table";
import Image from "next/image";
import { useMemo, useState } from "react";
import { GetAllAlatLatihanResponse } from "../../actions/get-all-alat-latihan";
import { getAllAlatLatihanQueryOptions } from "../../actions/get-all-alat-latihan/query-options";
import { CreateOrUpdateAlatLatihanForm } from "../form/create-or-update-alat-latihan-form";
import { DeleteAlatLatihanForm } from "../form/delete-alat-latihan-form";

export function DaftarAlatLatihanTable() {
  // QUERY DATA
  const tools = useQuery(getAllAlatLatihanQueryOptions());
  // END OF QUERY DATA

  // State to track for modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<
    GetAllAlatLatihanResponse[number] | null
  >(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // COLUMNS DEFINITION
  const columns = useMemo<MRT_ColumnDef<GetAllAlatLatihanResponse[number]>[]>(
    () => [
      {
        accessorKey: "imageUrl",
        header: "Gambar",
        size: 100,
        Cell: ({ row }) => {
          return (
            <div className="relative aspect-square h-56 w-56 overflow-hidden rounded-md">
              <Image
                src={row.original.imageUrl}
                alt={row.original.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
          );
        },
      },
      {
        accessorKey: "name",
        header: "Nama Alat",
        filterFn: "contains",
      },
      {
        header: "Aksi",
        Cell: ({ row }) => {
          return (
            <div className="flex justify-evenly">
              <Button
                color="green"
                onClick={() => {
                  setSelectedRow(row.original);
                  setIsEditModalOpen(true);
                }}
              >
                Edit
              </Button>
              <Button
                color="red"
                className="rounded-lg bg-[#FF0000] px-4 py-2 capitalize text-white shadow-xl"
                onClick={() => {
                  setSelectedRow(row.original);
                  setIsDeleteModalOpen(true);
                }}
              >
                Hapus
              </Button>
            </div>
          );
        },
      },
    ],
    [],
  );

  const table = useMantineReactTable({
    ...getDefautTableOptions({
      queryResult: tools,
    }),
    columns,
    enableRowNumbers: true,
    rowNumberDisplayMode: "original",
    data: tools.data ?? [],
  });

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Daftar Alat Latihan</h2>
        <Button
          color="green"
          className="px-4 py-2 capitalize text-white"
          onClick={() => setIsCreateModalOpen(true)}
        >
          tambahkan alat baru
        </Button>
      </div>
      <MantineReactTable table={table} />

      {selectedRow && (
        <>
          <Modal
            opened={isEditModalOpen}
            onClose={() => {
              setSelectedRow(null);
              setIsEditModalOpen(false);
            }}
            centered
            title={`Edit ${selectedRow.name}`}
          >
            <CreateOrUpdateAlatLatihanForm
              toolData={selectedRow}
              onSuccess={() => {
                setSelectedRow(null);
                setIsEditModalOpen(false);
                tools.refetch();
              }}
            />
          </Modal>

          <Modal
            opened={isDeleteModalOpen}
            onClose={() => {
              setSelectedRow(null);
              setIsDeleteModalOpen(false);
            }}
            centered
            title={`Hapus ${selectedRow.name}`}
          >
            <DeleteAlatLatihanForm
              toolData={selectedRow}
              onSuccess={() => {
                setSelectedRow(null);
                setIsDeleteModalOpen(false);
                tools.refetch();
              }}
            />
          </Modal>
        </>
      )}

      <Modal
        opened={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Tambah Alat Latihan"
        centered
      >
        <CreateOrUpdateAlatLatihanForm
          onSuccess={() => {
            setIsCreateModalOpen(false);
            tools.refetch();
          }}
        />
      </Modal>
    </>
  );
}
