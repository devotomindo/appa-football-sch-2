"use client";

import { GetAllStudentsBySchoolIdResponse } from "@/features/school/action/get-all-students-by-school-id";
import { getAllStudentsBySchoolIdQueryOptions } from "@/features/school/action/get-all-students-by-school-id/query-options";
import { getDefautTableOptions } from "@/lib/utils/mantine-react-table";
import { Avatar, Button } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import "dayjs/locale/id";
import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable,
} from "mantine-react-table";
import Link from "next/link";
import { useMemo } from "react";

export function DaftarPemainTable({ schoolId }: { schoolId: string }) {
  // QUERY DATA
  const schoolRegistrants = useQuery(
    getAllStudentsBySchoolIdQueryOptions(schoolId),
  );
  // END OF QUERY DATA

  // COLUMNS DEFINITION
  const columns = useMemo<
    MRT_ColumnDef<GetAllStudentsBySchoolIdResponse[number]>[]
  >(
    () => [
      {
        accessorKey: "userImageUrl",
        header: "Foto",
        size: 100,
        Cell: ({ row }) => {
          return (
            <Avatar
              src={row.original.userImageUrl}
              alt={row.original.userFullName ?? ""}
              size={"xl"}
              className="rounded-full"
            />
          );
        },
      },
      {
        accessorKey: "userFullName",
        header: "Nama",
        filterFn: "contains",
      },
      {
        header: "Aksi",
        Cell: ({ row }) => {
          return (
            <Button
              component={Link}
              href={`/dashboard/daftar-pemain/${row.original.id}`}
            >
              Lihat
            </Button>
          );
        },
      },
    ],
    [],
  );

  const table = useMantineReactTable({
    ...getDefautTableOptions({
      queryResult: schoolRegistrants,
    }),
    columns,
    enableRowNumbers: true,
    rowNumberDisplayMode: "original",
    data: schoolRegistrants.data ?? [],
  });

  return <MantineReactTable table={table} />;
}
