"use client";

import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { getAssessmentSessionBySchoolIdAndCompletionStatusQueryOptions } from "@/features/data-asesmen/actions/get-assessment-session-by-school-id-and-completion-status/query-options";
import { AssessmentSessionsTable } from "@/features/data-asesmen/components/table/assessment-sessions-table";
import { SchoolBanner } from "@/features/school/components/school-banner";
import { useSchoolInfo } from "@/features/school/hooks/use-school-info";
import { useSchoolStore } from "@/stores/school-store";
import { Button, Tabs } from "@mantine/core";
import { IconCheck, IconClockHour4 } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export function DaftarAsesmenView() {
  const selectedSchool = useSchoolStore((state) => state);
  const { data: schoolInfo } = useSchoolInfo(
    selectedSchool.selectedSchool?.id ?? "",
  );

  // Query for ongoing assessments
  const ongoingAssessmentsQuery = useQuery(
    getAssessmentSessionBySchoolIdAndCompletionStatusQueryOptions({
      schoolId: selectedSchool.selectedSchool?.id ?? "",
      isCompleted: false,
    }),
  );

  // Query for completed assessments
  const completedAssessmentsQuery = useQuery(
    getAssessmentSessionBySchoolIdAndCompletionStatusQueryOptions({
      schoolId: selectedSchool.selectedSchool?.id ?? "",
      isCompleted: true,
    }),
  );

  // Consider it loading during hydration or when waiting for school info
  const isLoading = selectedSchool && !schoolInfo;

  if (isLoading) {
    return (
      <DashboardSectionContainer>
        <div>Loading...</div>
      </DashboardSectionContainer>
    );
  }

  // Only show no school message after hydration is complete
  if (!selectedSchool.selectedSchool) {
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
    <DashboardSectionContainer>
      {schoolInfo && <SchoolBanner schoolInfo={schoolInfo} />}

      <div className="mt-10 space-y-4">
        <div className="flex items-center justify-between">
          <p className="font-bold uppercase">daftar asesmen</p>
          <Button
            component={Link}
            href="/dashboard/asesmen-pemain"
            color="blue"
          >
            Sesi Baru
          </Button>
        </div>

        <Tabs defaultValue="ongoing">
          <Tabs.List>
            <Tabs.Tab
              value="ongoing"
              leftSection={<IconClockHour4 size={16} />}
            >
              Sedang Berjalan
            </Tabs.Tab>
            <Tabs.Tab value="completed" leftSection={<IconCheck size={16} />}>
              Selesai
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="ongoing" pt="md">
            <AssessmentSessionsTable query={ongoingAssessmentsQuery} />
          </Tabs.Panel>

          <Tabs.Panel value="completed" pt="md">
            <AssessmentSessionsTable query={completedAssessmentsQuery} />
          </Tabs.Panel>
        </Tabs>
      </div>
    </DashboardSectionContainer>
  );
}
