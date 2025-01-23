"use client";

import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { SchoolBanner } from "@/features/school/components/school-banner";
import { useSchoolInfo } from "@/features/school/hooks/use-school-info";
import { GetUserByIdResponse } from "@/features/user/actions/get-user-by-id";

import { SchoolSession } from "@/lib/session";
import { useSchoolStore } from "@/stores/school-store";
import { Button } from "@mantine/core";
import Link from "next/link";
import { useEffect } from "react";
import { DaftarPemainTable } from "../table/daftar-pemain-table";

interface DashboardViewProps {
  userData: GetUserByIdResponse;
  initialSchoolSession: SchoolSession | null;
}

export function DaftarPemainView({
  userData,
  initialSchoolSession,
}: DashboardViewProps) {
  const { selectedSchool, hydrate, isHydrating } = useSchoolStore();
  const { data: schoolInfo } = useSchoolInfo(selectedSchool?.id ?? "");
  // Consider it loading during hydration or when waiting for school info
  const isLoading = isHydrating || (selectedSchool && !schoolInfo);

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
              <h1 className="mb-2 text-2xl font-semibold">Daftar Pemain</h1>
              <p>Daftar atlet yang terdaftar di SSB</p>
            </div>
            <Button
              component={Link}
              href={`/dashboard/daftar-registrasi-pemain`}
            >
              Lihat Daftar Registrasi
            </Button>
          </div>
          <DaftarPemainTable schoolId={schoolInfo?.id} />
        </div>
      </DashboardSectionContainer>
    )
  );
}
