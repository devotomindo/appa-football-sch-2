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
import { useMemo, useState } from "react";
import type { GetPenugasanLatihanIndividuByStudentIdResponse } from "../actions/get-penugasan-latihan-individu-by-student-id";
import { getPenugasanLatihanIndividuByStudentIdQueryOptions } from "../actions/get-penugasan-latihan-individu-by-student-id/query-options";
import { CreatePenugasanLatihanIndividuForm } from "../form/create-penugasan-latihan-individu-form";
import { DeletePenugasanLatihanIndividuForm } from "../form/delete-penugasan-latihan-individu-form";

export function DaftarPenugasanLatihanIndividuView({
  studentId,
}: {
  studentId: string;
}) {
  const [isAddModalOpen, { open, close }] = useDisclosure();
  const [
    isDeleteModalOpen,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure();
  // const [selectedExerciseId, setSelectedExerciseId] = useState<string>();
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>();
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
        accessorKey: "name",
      },
      {
        header: "Deskripsi",
        accessorKey: "description",
      },
      {
        header: "Aksi",
        Cell: ({ row }) => (
          <div className="space-x-2">
            <Button
              component={Link}
              href={"/dashboard/latihan/" + row.original.id}
              target="_blank"
              rel="noopener noreferrer"
              variant="light"
            >
              Lihat Latihan
            </Button>
            <Button
              variant="light"
              color="red"
              onClick={() => {
                setSelectedAssignmentId(row.original.assignmentId);
                openDeleteModal();
              }}
            >
              Hapus Latihan
            </Button>
          </div>
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
      <Modal
        opened={isDeleteModalOpen}
        onClose={() => {
          closeDeleteModal();
          setSelectedAssignmentId(undefined);
        }}
        centered
        title="Hapus Penugasan Latihan"
      >
        <DeletePenugasanLatihanIndividuForm
          assignmentId={selectedAssignmentId!}
          studentId={studentId}
          onSuccess={() => {
            closeDeleteModal();
            setSelectedAssignmentId(undefined);
            queryClient.invalidateQueries(
              getPenugasanLatihanIndividuByStudentIdQueryOptions(studentId),
            );
          }}
        />
      </Modal>
    </Stack>
  );
}
