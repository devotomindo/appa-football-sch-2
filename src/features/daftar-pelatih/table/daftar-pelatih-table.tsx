"use client";

import { getAllCoachesBySchoolIdQueryOptions } from "@/features/school/action/get-all-coaches-by-school-id/query-options";
import { GetSchoolRegistrantsBySchoolIdResponse } from "@/features/school/action/get-school-registrants";
import { getDefautTableOptions } from "@/lib/utils/mantine-react-table";
import { Avatar } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import "dayjs/locale/id";
import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable,
} from "mantine-react-table";
import { useMemo } from "react";

export function DaftarPelatihTable({ schoolId }: { schoolId: string }) {
  // QUERY DATA
  const schoolCoaches = useQuery(getAllCoachesBySchoolIdQueryOptions(schoolId));
  // END OF QUERY DATA

  // COLUMNS DEFINITION
  const columns = useMemo<
    MRT_ColumnDef<GetSchoolRegistrantsBySchoolIdResponse[number]>[]
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
    ],
    [],
  );

  const table = useMantineReactTable({
    ...getDefautTableOptions({
      queryResult: schoolCoaches,
    }),
    columns,
    enableRowNumbers: true,
    rowNumberDisplayMode: "original",
    data: schoolCoaches.data ?? [],
  });

  return <MantineReactTable table={table} />;
}
