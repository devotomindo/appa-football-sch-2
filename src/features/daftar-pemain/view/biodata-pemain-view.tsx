"use client";

import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { SchoolBanner } from "@/features/school/components/school-banner";
import { useSchoolInfo } from "@/features/school/hooks/use-school-info";
import { GetUserByIdResponse } from "@/features/user/actions/get-user-by-id";
import { getBiodataPemainByStudentIdQueryOptions } from "../actions/get-biodata-pemain-by-student-id/query-options";

import { SchoolSession } from "@/lib/session";
import { useSchoolStore } from "@/stores/school-store";
import { Avatar, Button, Card, Tabs } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect } from "react";

import { HasilAsesmenStudentIdTable } from "@/features/assesmen-pemain/components/table/hasil-asesmen-student-id-table";
import { calculateAge } from "@/lib/utils/age";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { DaftarPenugasanLatihanIndividuView } from "./daftar-penugasan-latihan-individu-view";

dayjs.locale("id");

export function BiodataPemainView({
  userData,
  initialSchoolSession,
  studentId,
}: {
  userData: GetUserByIdResponse;
  initialSchoolSession: SchoolSession | null;
  studentId: string;
}) {
  const { selectedSchool, hydrate, isHydrating } = useSchoolStore();
  const { data: schoolInfo } = useSchoolInfo(selectedSchool?.id ?? "");

  // Fetch athlete data
  const { data: biodataData, isLoading: isLoadingBiodata } = useQuery(
    getBiodataPemainByStudentIdQueryOptions(studentId),
  );

  // Consider it loading during hydration or when waiting for school info
  const isLoading =
    isHydrating || (selectedSchool && !schoolInfo) || isLoadingBiodata;

  useEffect(() => {
    hydrate(initialSchoolSession);
  }, [hydrate, initialSchoolSession]);

  if (isLoading) {
    return (
      <DashboardSectionContainer>
        <div>Loading...</div>
      </DashboardSectionContainer>
    );
  }

  // Only show no school message after hydration is complete
  if (!isHydrating && !selectedSchool) {
    return (
      // For users that just registered
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

  // Check if user is head coach
  const userIsHeadCoach =
    userData.schools?.find((school) => school.id === schoolInfo?.id)?.role ===
      "Head Coach" ||
    userData.schools?.find((school) => school.id === schoolInfo?.id)?.role ===
      "Coach";

  if (!userIsHeadCoach) {
    return (
      <DashboardSectionContainer>
        <div>Anda tidak memiliki akses ke halaman ini</div>
      </DashboardSectionContainer>
    );
  }

  return (
    schoolInfo && (
      <DashboardSectionContainer>
        {schoolInfo && (
          <SchoolBanner
            schoolInfo={schoolInfo}
            userIsHeadCoach={userIsHeadCoach}
          />
        )}

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-2xl font-semibold">Biodata Pemain</h1>
            </div>
          </div>

          {biodataData && (
            <Card className="mt-4">
              <div className="flex items-center gap-4">
                <Avatar
                  src={biodataData.avatarUrl ?? undefined}
                  size={"10rem"}
                  radius={"100%"}
                  alt={`Avatar ${biodataData.name}`}
                  name={biodataData.name ?? undefined}
                  color="initials"
                />
                <div>
                  <p className="text-2xl font-semibold">{biodataData.name}</p>
                  <p>
                    {calculateAge(new Date(biodataData.birthDate))} Tahun /{" "}
                    {dayjs(biodataData.birthDate).format("DD MMMM YYYY")}
                  </p>
                  <p>{biodataData.isMale ? "Laki-laki" : "Perempuan"}</p>
                  <p>
                    {biodataData.bodyHeight} cm / {biodataData.bodyWeight} kg
                  </p>
                  <p>
                    {biodataData.domisiliKota}, {biodataData.domisiliProvinsi}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="mt-8">
          <Tabs
            variant="pills"
            defaultValue="assessment"
            color="dark"
            radius={"xl"}
          >
            <Tabs.List>
              <Tabs.Tab value="assessment">Hasil Asesmen</Tabs.Tab>
              <Tabs.Tab value="assignedTrainings">
                Penugasan Latihan Individu
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="assessment" pt="md">
              <HasilAsesmenStudentIdTable studentId={studentId} />
            </Tabs.Panel>

            <Tabs.Panel value="assignedTrainings" pt="md">
              <DaftarPenugasanLatihanIndividuView studentId={studentId} />
            </Tabs.Panel>
          </Tabs>
        </div>
      </DashboardSectionContainer>
    )
  );
}
