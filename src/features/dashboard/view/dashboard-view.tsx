"use client";
import { BlackBackgroundContainer } from "@/components/container/black-backgorund-container";
import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { useSchoolInfo } from "@/features/school/hooks/use-school-info";
import { GetUserByIdResponse } from "@/features/user/actions/get-user-by-id";
import { isUserAdmin } from "@/features/user/utils/is-user-admin";
import type { SchoolSession } from "@/lib/session";
import { useSchoolStore } from "@/stores/school-store";
import { Button, Skeleton } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

interface DashboardViewProps {
  userData: GetUserByIdResponse;
  initialSchoolSession: SchoolSession | null;
}

export function DashboardView({
  userData,
  initialSchoolSession,
}: DashboardViewProps) {
  const userIsAdmin = isUserAdmin(userData);
  let isLoading = true;

  const { selectedSchool, hydrate } = useSchoolStore();

  useEffect(() => {
    hydrate(initialSchoolSession);
  }, [hydrate, initialSchoolSession]);

  const { data: schoolInfo } = useSchoolInfo(selectedSchool?.id ?? 0);

  const userIsHeadCoach =
    userData.schools?.find((school) => school.id === schoolInfo?.id)?.role ===
    "Head Coach";

  if (schoolInfo) {
    isLoading = false;
  }

  if (isLoading) {
    return (
      <DashboardSectionContainer>
        <div>Loading...</div>
      </DashboardSectionContainer>
    );
  }

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
      ) : schoolInfo ? ( // For users that are assigned to a school
        <>
          {/* Start of Banner */}
          <div
            className="flex items-center justify-between rounded-xl p-4 shadow-lg md:flex-row md:items-start md:gap-10 md:p-8"
            id="banner"
          >
            <div className="flex gap-6">
              <div className="relative h-full">
                {schoolInfo.imageUrl ? (
                  <Image
                    src={schoolInfo.imageUrl}
                    alt=""
                    width={80}
                    height={80}
                    className="md:w-[100px]"
                  />
                ) : (
                  <Skeleton circle height={100} />
                )}
              </div>

              <div className="space-y-4 text-center md:text-left">
                <p className="text-xl font-bold md:text-2xl">
                  {schoolInfo?.name ?? "Loading..."}
                </p>
                <div className="">
                  <p>{schoolInfo.address ?? "-"}</p>
                  <p>{schoolInfo.phone ?? "-"}</p>
                </div>
                <p className="font-bold">{schoolInfo?.fieldLocation ?? "-"}</p>
              </div>
            </div>

            {userIsHeadCoach && (
              <Button
                component={Link}
                href={`dashboard/update-ssb/${schoolInfo.id}`}
              >
                Ubah Detail Sekolah
              </Button>
            )}
          </div>
          {/* End of Banner */}

          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4">
            <BlackBackgroundContainer>
              <p className="relative z-10 text-8xl font-bold max-sm:text-7xl">
                5
              </p>
              <p className="relative z-10 font-bold capitalize">
                total pelatih
              </p>
            </BlackBackgroundContainer>
            <BlackBackgroundContainer>
              <p className="relative z-10 text-8xl font-bold max-sm:text-7xl">
                60
              </p>
              <p className="relative z-10 font-bold capitalize">pemain ku-8</p>
            </BlackBackgroundContainer>
            <BlackBackgroundContainer>
              <p className="relative z-10 text-8xl font-bold max-sm:text-7xl">
                40
              </p>
              <p className="relative z-10 font-bold capitalize">pemain ku-10</p>
            </BlackBackgroundContainer>
            <BlackBackgroundContainer>
              <p className="relative z-10 text-8xl font-bold max-sm:text-7xl">
                35
              </p>
              <p className="relative z-10 font-bold capitalize">pemain ku-13</p>
            </BlackBackgroundContainer>
            <BlackBackgroundContainer>
              <p className="relative z-10 text-8xl font-bold max-sm:text-7xl">
                30
              </p>
              <p className="relative z-10 font-bold capitalize">pemain ku-15</p>
            </BlackBackgroundContainer>
            <BlackBackgroundContainer>
              <p className="relative z-10 text-8xl font-bold max-sm:text-7xl">
                35
              </p>
              <p className="relative z-10 font-bold capitalize">pemain ku-17</p>
            </BlackBackgroundContainer>
          </div>
        </>
      ) : (
        // For users that just registered
        <div>
          <div>
            Anda belum terdaftar ke sekolah manapun. Daftarkan diri atau sekolah
            Anda
            <Button ml="sm">Daftar</Button>
          </div>
        </div>
      )}
    </DashboardSectionContainer>
  );
}
