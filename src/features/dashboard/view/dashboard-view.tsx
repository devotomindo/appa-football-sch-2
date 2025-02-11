"use client";
import { BlackBackgroundContainer } from "@/components/container/black-backgorund-container";
import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { getAssessmentScoresWithStudentIdQueryOptions } from "@/features/assesmen-pemain/components/actions/get-assessment-scores-with-student-id/query-options";
import { HasilAsesmenStudentIdTable } from "@/features/assesmen-pemain/components/table/hasil-asesmen-student-id-table";
import { getBiodataPemainByStudentIdQueryOptions } from "@/features/daftar-pemain/actions/get-biodata-pemain-by-student-id/query-options";
import { SchoolBanner } from "@/features/school/components/school-banner";
import { useSchoolInfo } from "@/features/school/hooks/use-school-info";
import { GetUserByIdResponse } from "@/features/user/actions/get-user-by-id";
import { isUserAdmin } from "@/features/user/utils/is-user-admin";
import type { SchoolSession } from "@/lib/session";
import { calculateAge } from "@/lib/utils/age";
import { useSchoolStore } from "@/stores/school-store";
import { Avatar, Button, Card } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import Link from "next/link";
import { useEffect } from "react";
import { getSchoolMemberQuantityQueryOptions } from "../actions/get-school-member-quantity/query-options";

export interface DashboardViewProps {
  userData: GetUserByIdResponse;
  initialSchoolSession: SchoolSession | null;
}

export function DashboardView({
  userData,
  initialSchoolSession,
}: DashboardViewProps) {
  const userIsAdmin = isUserAdmin(userData);
  const { selectedSchool, hydrate, isHydrating } = useSchoolStore();
  const studentId = selectedSchool?.studentId;
  const { data: schoolInfo } = useSchoolInfo(selectedSchool?.id ?? "");
  // Consider it loading during hydration or when waiting for school info
  const isLoading = isHydrating || (selectedSchool && !schoolInfo);
  const { data: schoolMemberQuantity } = useQuery(
    getSchoolMemberQuantityQueryOptions(schoolInfo?.id ?? ""),
  );
  console.log("userData", userData);
  const { data: biodataData, isLoading: isLoadingBiodata } = useQuery(
    getBiodataPemainByStudentIdQueryOptions(studentId ?? ""),
  );

  // Add this query
  const assessmentScoresQuery = useQuery(
    getAssessmentScoresWithStudentIdQueryOptions(studentId ?? ""),
  );

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

  const userIsHeadCoach =
    userData.schools?.find((school) => school.id === schoolInfo?.id)?.role ===
    "Head Coach";

  return (
    <DashboardSectionContainer>
      {userIsAdmin ? (
        <div>
          <div className="">
            <div className="flex items-center justify-between rounded-xl bg-black p-4 uppercase text-white shadow-lg">
              <p>statistik pengguna</p>
              <p>total omzet: 330.000.000</p>
            </div>
          </div>
          <div className="rounded-xl p-4 uppercase shadow-lg">
            <p>regional pengguna</p>
          </div>
        </div>
      ) : schoolInfo &&
        userData.schools[0].role.toLowerCase().includes("coach") ? ( // For users that are assigned to a school
        <>
          <SchoolBanner
            schoolInfo={schoolInfo}
            userIsHeadCoach={userIsHeadCoach}
          />

          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4">
            <BlackBackgroundContainer>
              <p className="relative z-10 text-8xl font-bold max-sm:text-7xl">
                {schoolMemberQuantity?.totalPelatih}
              </p>
              <p className="relative z-10 font-bold capitalize">
                total pelatih
              </p>
            </BlackBackgroundContainer>
            <BlackBackgroundContainer>
              <p className="relative z-10 text-8xl font-bold max-sm:text-7xl">
                {schoolMemberQuantity?.pemainKU8}
              </p>
              <p className="relative z-10 font-bold capitalize">
                pemain kelompok umur 5-8 tahun
              </p>
            </BlackBackgroundContainer>
            <BlackBackgroundContainer>
              <p className="relative z-10 text-8xl font-bold max-sm:text-7xl">
                {schoolMemberQuantity?.pemainKU10}
              </p>
              <p className="relative z-10 font-bold capitalize">
                pemain kelompok umur 9-12 tahun
              </p>
            </BlackBackgroundContainer>
            <BlackBackgroundContainer>
              <p className="relative z-10 text-8xl font-bold max-sm:text-7xl">
                {schoolMemberQuantity?.pemainKU13}
              </p>
              <p className="relative z-10 font-bold capitalize">
                pemain kelompok umur 13-15 tahun
              </p>
            </BlackBackgroundContainer>
            <BlackBackgroundContainer>
              <p className="relative z-10 text-8xl font-bold max-sm:text-7xl">
                {schoolMemberQuantity?.pemainKU15}
              </p>
              <p className="relative z-10 font-bold capitalize">
                pemain kelompok umur 16-18 tahun
              </p>
            </BlackBackgroundContainer>
          </div>
        </>
      ) : (
        <>
          {schoolInfo && (
            <SchoolBanner
              schoolInfo={schoolInfo}
              userIsHeadCoach={userIsHeadCoach}
            />
          )}
          <div className="mt-4 grid grid-cols-2 items-start gap-4">
            {isLoadingBiodata ? (
              <p>Loading biodata...</p>
            ) : (
              <Card>
                <h2 className="mb-4 text-xl font-semibold">Profil Pemain</h2>
                <div className="flex items-start gap-8 rounded-md border-2 border-gray-200 p-4 shadow-lg">
                  <Avatar
                    src={biodataData?.avatarUrl ?? undefined}
                    size={"20rem"}
                    radius={"2%"}
                    alt={`Avatar ${biodataData?.name}`}
                    name={biodataData?.name ?? undefined}
                    color="initials"
                    className="shadow-xl"
                  />
                  <div className="flex h-full flex-col justify-between gap-4">
                    <p className="text-2xl font-semibold capitalize">
                      Nama: {biodataData?.name}
                    </p>
                    <p>
                      Umur:{" "}
                      {biodataData?.birthDate
                        ? calculateAge(new Date(biodataData.birthDate))
                        : "-"}{" "}
                      Tahun
                    </p>
                    <p>
                      Tanggal lahir:{" "}
                      {biodataData?.birthDate
                        ? dayjs(biodataData.birthDate).format("DD MMMM YYYY")
                        : "-"}
                    </p>
                    <p>
                      Jenis kelamin:{" "}
                      {biodataData?.isMale ? "Laki-laki" : "Perempuan"}
                    </p>
                    <p>Tinggi Badan: {biodataData?.bodyHeight} cm</p>
                    <p>Berat Badan: {biodataData?.bodyWeight} kg</p>
                    <p>Kota: {biodataData?.domisiliKota}</p>
                    <p>Provinsi: {biodataData?.domisiliProvinsi}</p>
                  </div>
                </div>
              </Card>
            )}
            {/* Add HasilAsesmenStudentIdTable component */}
            <Card>
              <h2 className="mb-4 text-xl font-semibold">Hasil Asesmen</h2>
              {assessmentScoresQuery.isLoading ? (
                <div>Loading assessment data...</div>
              ) : studentId ? (
                <HasilAsesmenStudentIdTable studentId={studentId} />
              ) : (
                <div>No student ID available</div>
              )}
            </Card>
          </div>
        </>
      )}
    </DashboardSectionContainer>
  );
}
