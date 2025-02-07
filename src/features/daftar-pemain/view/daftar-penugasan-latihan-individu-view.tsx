"use client";

import { getDefautTableOptions } from "@/lib/utils/mantine-react-table";
import { Button, Modal, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from "mantine-react-table";
import Link from "next/link";
import { useMemo } from "react";
import type { GetPenugasanLatihanIndividuByStudentIdResponse } from "../actions/get-penugasan-latihan-individu-by-student-id";
import { getPenugasanLatihanIndividuByStudentIdQueryOptions } from "../actions/get-penugasan-latihan-individu-by-student-id/query-options";
import { CreatePenugasanLatihanIndividuForm } from "../form/create-penugasan-latihan-individu-form";

export function DaftarPenugasanLatihanIndividuView({
  studentId,
}: {
  studentId: string;
}) {
  const [isAddModalOpen, { open, close }] = useDisclosure();
  const queryClient = useQueryClient();

  const assignmentsQuery = useQuery(
    getPenugasanLatihanIndividuByStudentIdQueryOptions(studentId),
  );

  const columns = useMemo<
    MRT_ColumnDef<GetPenugasanLatihanIndividuByStudentIdResponse[number]>[]
  >(
    () => [
      {
        header: "Latihan",
        accessorKey: "training.name",
      },
      {
        header: "Deskripsi",
        accessorKey: "training.description",
      },
      {
        header: "Aksi",
        Cell: ({ row }) => (
          <Button
            component={Link}
            href={"/dashboard/latihan/" + row.original.id}
            target="_blank"
            rel="noopener noreferrer"
            variant="light"
          >
            Lihat Latihan
          </Button>
        ),
      },
    ],
    [],
  );

  const table = useMantineReactTable({
    ...getDefautTableOptions({
      queryResult: assignmentsQuery,
    }),
    columns,
    enableRowNumbers: true,
    data: assignmentsQuery.data ?? [],
  });

  return (
    <Stack>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Daftar Penugasan Latihan Individu
        </h1>
        <Button leftSection={<IconPlus />} onClick={open}>
          Tambah Penugasan Latihan Individu
        </Button>
      </div>

      <MantineReactTable table={table} />

      <Modal
        opened={isAddModalOpen}
        onClose={close}
        centered
        title="Tambah Penugasan Latihan"
      >
        <CreatePenugasanLatihanIndividuForm
          studentId={studentId}
          onSuccess={() => {
            close();
            queryClient.invalidateQueries(
              getPenugasanLatihanIndividuByStudentIdQueryOptions(studentId),
            );
          }}
        />
      </Modal>
    </Stack>
  );
}
