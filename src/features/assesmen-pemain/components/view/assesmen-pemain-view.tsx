"use client";

import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { SchoolBanner } from "@/features/school/components/school-banner";
import { useSchoolInfo } from "@/features/school/hooks/use-school-info";
import { SchoolSession } from "@/lib/session";
import { useSchoolStore } from "@/stores/school-store";
import { Button, Tabs } from "@mantine/core";
import { IconClipboard } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAllAssessmentCategoriesQueryOptions } from "../../../data-asesmen/actions/get-all-assessment-categories/query-options";
import { getAssessmentsByCategoryQueryOptions } from "../../../data-asesmen/actions/get-assessments-by-category/query-options";

function TabsPanel({
  name,
  id,
  category,
  value,
}: {
  name: string;
  id: string;
  category: string;
  value: string;
}) {
  return (
    <Tabs.Panel
      value={value}
      className="flex w-full items-center justify-between border-b-[1px] border-gray-200 px-4 pb-2"
    >
      <div className="flex items-center gap-2 uppercase">
        <IconClipboard />
        {name} - {category}
      </div>
      <Link
        href={`/dashboard/asesmen-pemain/asesmen/${id}`}
        className="rounded-xl bg-green-600 px-8 py-2 uppercase text-white"
      >
        lakukan asesmen
      </Link>
    </Tabs.Panel>
  );
}

export function AsesmenPemainView({
  initialSchoolSession,
}: {
  initialSchoolSession: SchoolSession | null;
}) {
  const { selectedSchool, hydrate, isHydrating } = useSchoolStore();
  const { data: schoolInfo } = useSchoolInfo(selectedSchool?.id ?? "");
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const { data: assessmentCategories } = useQuery(
    getAllAssessmentCategoriesQueryOptions(),
  );

  const { data: filteredAssessments } = useQuery(
    getAssessmentsByCategoryQueryOptions(activeCategory),
  );

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

  return (
    <DashboardSectionContainer>
      {schoolInfo && <SchoolBanner schoolInfo={schoolInfo} />}
      <div className="mt-10 space-y-4">
        <p className="font-bold uppercase">daftar asesmen</p>
        <div className="flex justify-between">
          <Tabs
            defaultValue="semuaKategori"
            onChange={(value) =>
              setActiveCategory(
                value === "semuaKategori" ? null : Number(value),
              )
            }
            color="dark"
            variant="pills"
            radius="md"
          >
            <Tabs.List className="space-x-4">
              <Tabs.Tab value="semuaKategori" className="uppercase">
                semua kategori
              </Tabs.Tab>
              {assessmentCategories?.map((category) => (
                <Tabs.Tab
                  key={category.id}
                  value={category.id.toString()}
                  className="uppercase"
                >
                  {category.name}
                </Tabs.Tab>
              ))}
            </Tabs.List>

            <div className="mt-14 space-y-6">
              {filteredAssessments?.map((assessment) => (
                <TabsPanel
                  key={assessment.id}
                  id={assessment.id}
                  name={assessment.name ?? ""}
                  category={
                    assessmentCategories?.find(
                      (cat) => cat.id === assessment.categoryId,
                    )?.name ?? ""
                  }
                  value={activeCategory?.toString() ?? "semuaKategori"}
                />
              ))}
            </div>
          </Tabs>
        </div>
      </div>
    </DashboardSectionContainer>
  );
}
