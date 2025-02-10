"use client";

import { GetStudentsBeingGradedByPenilaianIdResponse } from "@/features/data-asesmen/actions/get-students-being-graded-by-penilaian-id";
import { getStudentsBeingGradedByPenilaianIdQueryOptions } from "@/features/data-asesmen/actions/get-students-being-graded-by-penilaian-id/query-options";
import { ActionIcon, Avatar, Badge, Button, Modal, Tabs } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable,
} from "mantine-react-table";
import { useMemo, useState } from "react";
import { CompleteSessionForm } from "../form/complete-session-form";
import { RecordPenilaianForm } from "../form/record-penilaian-form";

const AGE_GROUPS = ["Semua", "5-8", "9-12", "13-15", "16-18", "Other"] as const;

export function PesertaPenilaianTable({
  penilaianId,
  isPenilaianCompleted,
  gradeMetric,
}: {
  penilaianId: string;
  isPenilaianCompleted: boolean;
  gradeMetric?: string;
}) {
  const [activeTab, setActiveTab] = useState<string>("Semua");

  const schoolStudents = useQuery(
    getStudentsBeingGradedByPenilaianIdQueryOptions(penilaianId),
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
  }, [schoolStudents, schoolStudents.data]);

  // Track modified values and their original values
  const [modifiedScores, setModifiedScores] = useState<
    Map<
      string,
      {
        original: number | undefined;
        current: number | undefined;
      }
    >
  >(new Map());

  const handleScoreChange = (
    recordId: string,
    newValue: number | undefined,
    originalValue: number | null | undefined, // Update type to include null
  ) => {
    setModifiedScores((prev) => {
      const next = new Map(prev);
      // Only track if value is different from original (accounting for null)
      if (newValue !== (originalValue ?? undefined)) {
        next.set(recordId, {
          original: originalValue ?? undefined,
          current: newValue,
        });
      } else {
        next.delete(recordId); // Remove if value matches original
      }
      return next;
    });
  };

  const handleScoreSaved = (
    recordId: string,
    newValue: number | undefined | null,
  ) => {
    setModifiedScores((prev) => {
      const next = new Map(prev);
      // Remove from modified scores and update schoolStudents data
      next.delete(recordId);

      // Update the data in the table
      schoolStudents.data?.forEach((student) => {
        if (student.id === recordId) {
          student.score = newValue ?? null;
        }
      });

      return next;
    });
  };

  const columns = useMemo<
    MRT_ColumnDef<GetStudentsBeingGradedByPenilaianIdResponse[number]>[]
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
      {
        header: `Nilai (${gradeMetric})`,
        Cell: ({ row }) => {
          if (!isPenilaianCompleted) {
            const hasRealChanges = modifiedScores.has(row.original.id);
            return (
              <div className="flex items-center gap-2">
                <RecordPenilaianForm
                  recordId={row.original.id}
                  score={row.original.score ?? undefined}
                  onSuccess={() =>
                    handleScoreSaved(row.original.id, row.original.score)
                  }
                  onChange={(newValue) =>
                    handleScoreChange(
                      row.original.id,
                      newValue,
                      row.original.score ?? undefined,
                    )
                  }
                />
                {hasRealChanges && (
                  <ActionIcon radius={"xl"} color="yellow">
                    <IconAlertCircle />
                  </ActionIcon>
                )}
              </div>
            );
          } else {
            return (
              <div className="flex items-center gap-2">
                {row.original.score ?? "-"}
              </div>
            );
          }
        },
      },
    ],
    [modifiedScores, schoolStudents.data], // Add schoolStudents.data to dependencies
  );

  const table = useMantineReactTable({
    columns,
    data: groupedStudents[activeTab] ?? [],
  });

  const [isEndModalOpen, setIsEndModalOpen] = useState(false);

  const handleCompleteSession = () => {
    if (modifiedScores.size > 0) {
      notifications.show({
        color: "yellow",
        title: "Perubahan Belum Tersimpan",
        message: `Terdapat ${modifiedScores.size} nilai yang belum tersimpan. Harap simpan semua perubahan sebelum menyelesaikan sesi.`,
      });
      return;
    }

    setIsEndModalOpen(true);
  };

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
      </div>

      <MantineReactTable table={table} />

      <div className="mt-6 flex items-center justify-end gap-4">
        {modifiedScores.size > 0 && (
          <Badge color="yellow" size="lg">
            {modifiedScores.size} perubahan belum tersimpan
          </Badge>
        )}
        {!isPenilaianCompleted && (
          <Button
            color="green"
            onClick={handleCompleteSession}
            className="px-6"
          >
            Selesaikan Penilaian
          </Button>
        )}
      </div>

      <Modal
        title="Selesaikan Penilaian"
        opened={isEndModalOpen}
        onClose={() => setIsEndModalOpen(false)}
        centered
      >
        <CompleteSessionForm
          sessionId={penilaianId}
          onSuccess={() => {
            setIsEndModalOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}
