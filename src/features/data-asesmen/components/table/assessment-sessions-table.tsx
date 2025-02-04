"use client";

import { getDefautTableOptions } from "@/lib/utils/mantine-react-table";
import { Button } from "@mantine/core";
import { IconEye } from "@tabler/icons-react";
import { UseQueryResult } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from "mantine-react-table";
import Link from "next/link";
import { useMemo } from "react";
import { GetAssessmentSessionBySchoolIdAndCompletionStatusResponse } from "../../actions/get-assessment-session-by-school-id-and-completion-status";

type AssessmentSessionsTableProps = {
  query: UseQueryResult<GetAssessmentSessionBySchoolIdAndCompletionStatusResponse>;
};

export function AssessmentSessionsTable({
  query,
}: AssessmentSessionsTableProps) {
  const columns = useMemo<
    MRT_ColumnDef<
      GetAssessmentSessionBySchoolIdAndCompletionStatusResponse[number]
    >[]
  >(
    () => [
      {
        accessorFn: (row) => row.assessment?.name ?? "-",
        id: "assessmentName",
        header: "Nama Asesmen",
        filterVariant: "text",
      },
      {
        accessorFn: (row) => row.assessment?.category ?? "-",
        id: "category",
        header: "Kategori Asesmen",
        filterVariant: "text",
      },
      {
        accessorFn: (row) => dayjs(row.createdAt).format("DD/MM/YYYY, HH:mm"),
        id: "createdAt",
        header: "Tanggal Mulai",
        filterVariant: "date-range",
      },
      {
        accessorFn: (row) =>
          row.completedAt
            ? dayjs(row.completedAt).format("DD/MM/YYYY, HH:mm")
            : "-",
        id: "completedAt",
        header: "Tanggal Selesai",
        filterVariant: "date-range",
      },
      {
        header: "Aksi",
        size: 100,
        Cell: ({ row }) => (
          <Button
            component={Link}
            href={`/dashboard/asesmen-pemain/penilaian/${row.original.id}`}
            leftSection={<IconEye size={16} />}
            size="xs"
          >
            Lihat
          </Button>
        ),
      },
    ],
    [],
  );

  const table = useMantineReactTable({
    ...getDefautTableOptions({
      queryResult: query,
    }),
    columns,
    enableRowNumbers: true,
    rowNumberDisplayMode: "original",
    data: query.data ?? [],
  });

  return <MantineReactTable table={table} />;
}
