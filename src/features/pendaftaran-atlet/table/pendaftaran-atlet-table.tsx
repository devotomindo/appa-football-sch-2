"use client";

import {
  getUserSchoolsMemberByUserIdQueryOptions,
  GetUserSchoolsMemberByUserIdResponse,
} from "@/features/user/actions/get-user-schools-member-by-user-id/query-options";
import { getDefautTableOptions } from "@/lib/utils/mantine-react-table";
import { useQuery } from "@tanstack/react-query";
import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable,
} from "mantine-react-table";
import Image from "next/image";
import { useMemo } from "react";

export function PendaftaranAtletTable({ userId }: { userId: string }) {
  // QUERY DATA
  const currentUserSchools = useQuery(
    getUserSchoolsMemberByUserIdQueryOptions(userId),
  );
  // END OF QUERY DATA

  // COLUMNS DEFINITION
  const columns = useMemo<
    MRT_ColumnDef<GetUserSchoolsMemberByUserIdResponse[number]>[]
  >(
    () => [
      {
        accessorKey: "schoolName",
        header: "Nama SSB",
        filterFn: "contains",
        Cell: ({ row }) => {
          return (
            <div className="flex items-center space-x-2">
              {row.original.schoolImageUrl && row.original.schoolName && (
                <Image
                  src={row.original.schoolImageUrl}
                  alt={row.original.schoolName}
                  width={50}
                  height={50}
                  className="rounded-full object-cover"
                />
              )}
              <span>{row.original.schoolName}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "roleName",
        header: "Peran",
        filterFn: "contains",
      },
      {
        accessorKey: "isApproved",
        header: "Status",
        filterFn: "contains",
        Cell: ({ row }) => {
          return row.original.isApproved ? "Disetujui" : "Menunggu Persetujuan";
        },
      },
    ],
    [],
  );

  const table = useMantineReactTable({
    ...getDefautTableOptions({
      queryResult: currentUserSchools,
    }),
    columns,
    enableRowNumbers: true,
    rowNumberDisplayMode: "original",
    data: currentUserSchools.data ?? [],
  });

  return <MantineReactTable table={table} />;
}
