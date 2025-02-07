"use client";
import { BlackBackgroundContainer } from "@/components/container/black-backgorund-container";
import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { SchoolBanner } from "@/features/school/components/school-banner";
import { useSchoolInfo } from "@/features/school/hooks/use-school-info";
import { GetUserByIdResponse } from "@/features/user/actions/get-user-by-id";
import { isUserAdmin } from "@/features/user/utils/is-user-admin";
import type { SchoolSession } from "@/lib/session";
import { useSchoolStore } from "@/stores/school-store";
import { Button } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
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
  const { data: schoolInfo } = useSchoolInfo(selectedSchool?.id ?? "");
  // Consider it loading during hydration or when waiting for school info
  const isLoading = isHydrating || (selectedSchool && !schoolInfo);
  const { data: schoolMemberQuantity } = useQuery(
    getSchoolMemberQuantityQueryOptions(schoolInfo?.id ?? ""),
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
      ) : (
        schoolInfo && ( // For users that are assigned to a school
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
              <BlackBackgroundContainer>
                <p className="relative z-10 text-8xl font-bold max-sm:text-7xl">
                  {schoolMemberQuantity?.pemainKU17}
                </p>
                <p className="relative z-10 font-bold capitalize">
                  pemain ku-17
                </p>
              </BlackBackgroundContainer>
            </div>
          </>
        )
      )}
    </DashboardSectionContainer>
  );
}
