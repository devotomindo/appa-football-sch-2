"use client";

import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { getAssessmentScoresOfCurrentAthleteWithSchoolIdQueryOptions } from "@/features/assesmen-pemain/components/actions/get-assessment-scores-of-current-athlete-with-school-id/query-options";
import { useSchoolStore } from "@/stores/school-store";
import { Alert, Button } from "@mantine/core";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/id";
import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable,
} from "mantine-react-table";
import Link from "next/link";
import { useMemo } from "react";
import { getAssessmentScoresOfCurrentAthleteWithSchoolIdResponse } from "../actions/get-assessment-scores-of-current-athlete-with-school-id";

dayjs.locale("id");

export function HasilAsesmenPemainTable() {
  // Get current school
  const selectedSchool = useSchoolStore((state) => state);
  const schoolId = selectedSchool.selectedSchool?.id;

  // Get Assessment scores with proper error handling
  const assessmentScoresQuery = useQuery({
    ...getAssessmentScoresOfCurrentAthleteWithSchoolIdQueryOptions(
      schoolId ?? "",
    ),
    enabled: !!schoolId,
  });

  const columns = useMemo<
    MRT_ColumnDef<
      getAssessmentScoresOfCurrentAthleteWithSchoolIdResponse[number]
    >[]
  >(
    () => [
      {
        header: "Nama Asesmen",
        accessorKey: "assessmentSession.assessment.name",
        filterFn: "contains",
      },
      {
        header: "Nilai",
        accessorFn: (row) => {
          const score = row.score ?? "-";
          const metric =
            row.assessmentSession?.assessment?.gradeMetric?.metric ?? "";

          // Find previous record of the same assessment type
          const currentDate = new Date(row.assessmentSession?.createdAt);
          const sameTypeScores =
            assessmentScoresQuery.data?.filter(
              (r) =>
                r.assessmentSession?.assessment?.id ===
                row.assessmentSession?.assessment?.id,
            ) ?? [];

          const previousScore = sameTypeScores.find(
            (r) => new Date(r.assessmentSession?.createdAt) < currentDate,
          );

          // Return just the score if no comparison is available
          if (!previousScore || !row.score || !previousScore.score) {
            return `${score} ${metric}`;
          }

          const isHigherBetter =
            row.assessmentSession?.assessment?.isHigherGradeBetter;
          const difference = row.score - previousScore.score;
          const improved = isHigherBetter ? difference > 0 : difference < 0;

          return (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span>{`${score} ${metric}`}</span>
              </div>
              {previousScore && row.score && (
                <div className="flex items-center gap-1">
                  {improved ? (
                    <IconArrowUp className="text-green-500" size={16} />
                  ) : (
                    <IconArrowDown className="text-red-500" size={16} />
                  )}
                  <span
                    className={`text-xs ${
                      improved ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {`${difference > 0 ? "+" : ""}${difference.toFixed(1)} ${metric}`}
                  </span>
                </div>
              )}
            </div>
          );
        },
      },
      {
        header: "Hasil Terbaik",
        accessorFn: (row) => {
          const sameTypeScores =
            assessmentScoresQuery.data?.filter(
              (r) =>
                r.assessmentSession?.assessment?.id ===
                row.assessmentSession?.assessment?.id,
            ) ?? [];

          const personalBestRecord = sameTypeScores.find(
            (r) => r.isPersonalBest,
          );

          if (!personalBestRecord?.score) return "-";

          const metric =
            row.assessmentSession?.assessment?.gradeMetric?.metric ?? "";

          return (
            <div className="flex items-center gap-1">
              <span>
                {personalBestRecord.score} {metric}
              </span>
              {row.isPersonalBest && (
                <span className="text-xs font-medium text-yellow-500">
                  (Rekor)
                </span>
              )}
            </div>
          );
        },
      },
      {
        header: "Tanggal Asesmen",
        accessorFn: (row) =>
          dayjs(row.assessmentSession?.createdAt).format("DD/MM/YYYY"),
        filterVariant: "date-range",
      },
    ],
    [assessmentScoresQuery.data],
  );

  const table = useMantineReactTable({
    columns,
    data: assessmentScoresQuery.data ?? [],
    state: {
      isLoading: assessmentScoresQuery.isLoading,
      showAlertBanner: assessmentScoresQuery.isError,
      showProgressBars: assessmentScoresQuery.isFetching,
    },
    enableRowSelection: false,
    enableColumnOrdering: true,
    enableGlobalFilter: true,
    enableColumnFilters: true,
    enableSorting: true,
    enablePagination: true,
    manualPagination: false,
    enableRowNumbers: true,
    rowNumberDisplayMode: "static",
    renderEmptyRowsFallback: () => <Alert>Data asesmen tidak ditemukan</Alert>,
  });

  if (!selectedSchool.isHydrating && !schoolId) {
    return (
      <DashboardSectionContainer>
        <div>
          Anda belum terdaftar ke sekolah manapun. Daftarkan diri atau sekolah
          Anda
          <Button
            component={Link}
            href={"/dashboard/pendaftaran-atlet"}
            ml="sm"
          >
            Daftar
          </Button>
        </div>
      </DashboardSectionContainer>
    );
  }

  return (
    <div className="space-y-4">
      <MantineReactTable table={table} />
    </div>
  );
}
