"use client";

import { GetAllStudentsBySchoolIdResponse } from "@/features/school/action/get-all-students-by-school-id";
import { getAllStudentsBySchoolIdQueryOptions } from "@/features/school/action/get-all-students-by-school-id/query-options";
import { Avatar, Tabs } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable,
} from "mantine-react-table";
import { useMemo, useState } from "react";
import { MulaiAsesmenPemainForm } from "../form/mulai-asesmen-pemain-form";

const AGE_GROUPS = ["Semua", "5-8", "9-12", "13-15", "16-18", "Other"] as const;

export function PesertaAsesmenTable({
  assessmentId,
  schoolId,
}: {
  assessmentId: string;
  schoolId: string;
}) {
  const [activeTab, setActiveTab] = useState<string>("Semua");
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const schoolStudents = useQuery(
    getAllStudentsBySchoolIdQueryOptions(schoolId),
  );

  const groupedStudents = useMemo(() => {
    if (!schoolStudents.data) return {};

    return schoolStudents.data.reduce(
      (acc, student) => {
        // Initialize "Semua" group if it doesn't exist
        if (!acc["Semua"]) acc["Semua"] = [];
        // Add to "Semua" group
        acc["Semua"].push(student);

        // Add to specific age group
        const group = student.ageGroup ?? "Other";
        if (!acc[group]) acc[group] = [];
        if (group !== "Semua") acc[group].push(student);

        return acc;
      },
      {} as Record<string, typeof schoolStudents.data>,
    );
  }, [schoolStudents.data]);

  const columns = useMemo<
    MRT_ColumnDef<GetAllStudentsBySchoolIdResponse[number]>[]
  >(
    () => [
      {
        accessorKey: "userImageUrl",
        header: "Foto",
        size: 100,
        Cell: ({ row }) => (
          <Avatar
            src={row.original.userImageUrl}
            alt={row.original.userFullName ?? ""}
            size={"xl"}
            className="rounded-full"
          />
        ),
      },
      {
        accessorKey: "userFullName",
        header: "Nama",
        filterFn: "contains",
      },
      {
        accessorKey: "age",
        header: "Umur",
        filterFn: "contains",
      },
    ],
    [],
  );

  const table = useMantineReactTable({
    columns,
    data: groupedStudents[activeTab] ?? [],
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row.userId,
    enableRowSelection: (row) => row.original.isPremium,
    renderRowActionMenuItems: undefined,
    mantineTableBodyRowProps: ({ row }) => ({
      ...(!row.original.isPremium && {
        style: { cursor: "not-allowed", opacity: 0.7 },
      }),
    }),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs
          value={activeTab}
          color="dark"
          variant="pills"
          radius={"md"}
          onChange={(value) => setActiveTab(value ?? AGE_GROUPS[0])}
        >
          <Tabs.List>
            {AGE_GROUPS.map((group) => (
              <Tabs.Tab
                key={group}
                value={group}
                rightSection={
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                      activeTab === group
                        ? "bg-white text-black"
                        : "bg-gray-700 text-gray-200"
                    }`}
                  >
                    {groupedStudents[group]?.length ?? 0}
                  </span>
                }
              >
                {group}
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>

        <MulaiAsesmenPemainForm
          assessmentId={assessmentId}
          studentIds={Object.keys(rowSelection)}
        />
      </div>

      <div className="relative">
        <MantineReactTable table={table} />
        {/* Add tooltips individually to non-premium rows via mantineTableBodyRowProps instead */}
      </div>
    </div>
  );
}
