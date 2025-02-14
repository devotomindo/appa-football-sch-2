"use client";
import { BlackBackgroundContainer } from "@/components/container/black-backgorund-container";
import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { getAssessmentScoresWithStudentIdQueryOptions } from "@/features/assesmen-pemain/components/actions/get-assessment-scores-with-student-id/query-options";
import { HasilAsesmenStudentIdTable } from "@/features/assesmen-pemain/components/table/hasil-asesmen-student-id-table";
import { getAllLatihanIndividuByStudentIdQueryOptions } from "@/features/daftar-latihan/actions/get-all-latihan-individu/query-options";
import { getBiodataPemainByStudentIdQueryOptions } from "@/features/daftar-pemain/actions/get-biodata-pemain-by-student-id/query-options";
import { SchoolBanner } from "@/features/school/components/school-banner";
import { useSchoolInfo } from "@/features/school/hooks/use-school-info";
import { GetUserByIdResponse } from "@/features/user/actions/get-user-by-id";
import { isUserAdmin } from "@/features/user/utils/is-user-admin";
import type { SchoolSession } from "@/lib/session";
import { calculateAge } from "@/lib/utils/age";
import { useSchoolStore } from "@/stores/school-store";
import { Avatar, Button, TextInput } from "@mantine/core";
import { IconSearch, IconVideoOff } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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
  const { data: biodataData, isLoading: isLoadingBiodata } = useQuery(
    getBiodataPemainByStudentIdQueryOptions(studentId ?? ""),
  );
  const { data: tugasLatihanIndividuData, isLoading: isLoadingTugasLatihan } =
    useQuery(getAllLatihanIndividuByStudentIdQueryOptions(studentId ?? ""));

  // Add this query
  const assessmentScoresQuery = useQuery(
    getAssessmentScoresWithStudentIdQueryOptions(studentId ?? ""),
  );

  const [searchTerm, setSearchTerm] = useState("");

  const filteredTugasLatihan = useMemo(() => {
    if (!tugasLatihanIndividuData) return [];
    return tugasLatihanIndividuData.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [tugasLatihanIndividuData, searchTerm]);

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
        userData?.schools?.[0]?.role.toLowerCase().includes("coach") ? ( // For users that are assigned to a school
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
                {schoolMemberQuantity?.pemainKU58}
              </p>
              <p className="relative z-10 font-bold capitalize">
                pemain kelompok umur 5-8 tahun
              </p>
            </BlackBackgroundContainer>
            <BlackBackgroundContainer>
              <p className="relative z-10 text-8xl font-bold max-sm:text-7xl">
                {schoolMemberQuantity?.pemainKU912}
              </p>
              <p className="relative z-10 font-bold capitalize">
                pemain kelompok umur 9-12 tahun
              </p>
            </BlackBackgroundContainer>
            <BlackBackgroundContainer>
              <p className="relative z-10 text-8xl font-bold max-sm:text-7xl">
                {schoolMemberQuantity?.pemainKU1315}
              </p>
              <p className="relative z-10 font-bold capitalize">
                pemain kelompok umur 13-15 tahun
              </p>
            </BlackBackgroundContainer>
            <BlackBackgroundContainer>
              <p className="relative z-10 text-8xl font-bold max-sm:text-7xl">
                {schoolMemberQuantity?.pemainKU1618}
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

          {/* Modern Player Dashboard */}
          <div className="mt-8 space-y-8">
            {/* Player Stats Overview Cards */}
            <div className="grid grid-cols-2 gap-6">
              {" "}
              {/* Changed from grid-cols-3 to grid-cols-2 */}
              <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 p-6 text-white shadow-lg">
                <div className="text-sm font-medium opacity-80">
                  Total Latihan
                </div>
                <div className="mt-2 text-3xl font-bold">
                  {isLoadingTugasLatihan
                    ? "..."
                    : tugasLatihanIndividuData?.length || 0}
                </div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 p-6 text-white shadow-lg">
                <div className="text-sm font-medium opacity-80">
                  Kelompok Umur
                </div>
                <div className="mt-2 text-3xl font-bold">
                  {isLoadingBiodata ? (
                    "..."
                  ) : biodataData?.birthDate ? (
                    <>
                      {calculateAge(new Date(biodataData.birthDate)) <= 8
                        ? "KU 5-8"
                        : calculateAge(new Date(biodataData.birthDate)) <= 12
                          ? "KU 9-12"
                          : calculateAge(new Date(biodataData.birthDate)) <= 15
                            ? "KU 13-15"
                            : "KU 16-18"}
                    </>
                  ) : (
                    "-"
                  )}
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-12 gap-8">
              {/* Player Profile Card */}
              <div className="col-span-4 rounded-2xl bg-white p-6 shadow-xl">
                {isLoadingBiodata ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-gray-500">Loading profile data...</div>
                  </div>
                ) : (
                  <div className="relative pt-16">
                    {" "}
                    {/* Added pt-16 for top padding */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 transform">
                      {" "}
                      {/* Changed from -top-12 to -top-4 */}
                      <Avatar
                        src={biodataData?.avatarUrl ?? undefined}
                        size={120}
                        radius={120}
                        className="shadow-2xl ring-4 ring-white"
                      />
                    </div>
                    <div className="mt-20 text-center">
                      {" "}
                      {/* Changed from mt-16 to mt-20 */}
                      <h2 className="text-2xl font-bold capitalize">
                        {biodataData?.name}
                      </h2>
                      <p className="text-gray-500">ID: {studentId}</p>
                    </div>
                    <div className="mt-8 space-y-4 divide-y">
                      <div className="grid grid-cols-2 py-3">
                        <span className="text-gray-500">Umur</span>
                        <span className="font-medium">
                          {biodataData?.birthDate
                            ? `${calculateAge(new Date(biodataData.birthDate))} Tahun`
                            : "-"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 py-3">
                        <span className="text-gray-500">Tinggi</span>
                        <span className="font-medium">
                          {biodataData?.bodyHeight} cm
                        </span>
                      </div>
                      <div className="grid grid-cols-2 py-3">
                        <span className="text-gray-500">Berat</span>
                        <span className="font-medium">
                          {biodataData?.bodyWeight} kg
                        </span>
                      </div>
                      <div className="grid grid-cols-2 py-3">
                        <span className="text-gray-500">Kota</span>
                        <span className="font-medium">
                          {biodataData?.domisiliKota}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Assessment Results */}
              <div className="col-span-8 rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold">Hasil Asesmen</h2>
                  <Button variant="light" radius="xl">
                    Lihat Semua
                  </Button>
                </div>
                {assessmentScoresQuery.isLoading ? (
                  <div className="flex h-48 items-center justify-center">
                    <div className="text-gray-500">
                      Loading assessment data...
                    </div>
                  </div>
                ) : studentId ? (
                  <HasilAsesmenStudentIdTable studentId={studentId} />
                ) : null}
              </div>
            </div>

            {/* Training Recommendations */}
            <div className="rounded-2xl bg-white p-6 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  Rekomendasi Latihan Oleh Pelatih
                </h2>
                <TextInput
                  placeholder="Cari latihan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-72"
                  radius="xl"
                  rightSection={<IconSearch size={16} />}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                {isLoadingTugasLatihan ? (
                  <div className="col-span-2 flex h-48 items-center justify-center">
                    <div className="text-gray-500">Loading...</div>
                  </div>
                ) : filteredTugasLatihan.length > 0 ? (
                  filteredTugasLatihan.map((item, index) => (
                    <div
                      key={index}
                      className="group relative overflow-hidden rounded-xl border bg-white p-4 shadow-lg transition-all hover:shadow-xl"
                    >
                      <div className="aspect-video w-full overflow-hidden rounded-lg">
                        {item.videoUrl ? (
                          <video
                            src={item.videoUrl}
                            controls
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gray-100">
                            <IconVideoOff className="text-gray-400" size={32} />
                          </div>
                        )}
                      </div>
                      <div className="mt-4 space-y-2">
                        <h3 className="text-lg font-bold capitalize">
                          {item.name}
                        </h3>
                        <p className="line-clamp-2 text-sm text-gray-600">
                          {item.description}
                        </p>
                        <Button
                          component={Link}
                          href={`/dashboard/latihan/${item.id}`}
                          className="mt-4 w-full"
                          variant="filled"
                          radius="md"
                        >
                          Mulai Latihan
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 flex h-48 items-center justify-center text-gray-500">
                    {searchTerm
                      ? "Tidak ada latihan yang sesuai dengan pencarian"
                      : "Tidak ada latihan yang direkomendasikan"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardSectionContainer>
  );
}
