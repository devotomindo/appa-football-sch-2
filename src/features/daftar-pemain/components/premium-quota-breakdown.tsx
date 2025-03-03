"use client";

import { getAllStudentsBySchoolIdQueryOptions } from "@/features/school/action/get-all-students-by-school-id/query-options";
import { getPremiumQuotaBySchoolIdQueryOptions } from "@/features/school/action/get-premium-quota-by-school-id/query-options";
import { Card, Grid, Stack, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

export function PremiumQuotaBreakdown({ schoolId }: { schoolId: string }) {
  const quotaQuery = useQuery(getPremiumQuotaBySchoolIdQueryOptions(schoolId));
  const studentsQuery = useQuery(
    getAllStudentsBySchoolIdQueryOptions(schoolId),
  );

  if (quotaQuery.isLoading || studentsQuery.isLoading) {
    return (
      <Card withBorder p="md">
        <Title order={4}>Penggunaan Premium</Title>
        <Text size="sm">Memuat data...</Text>
      </Card>
    );
  }

  if (quotaQuery.isError || studentsQuery.isError) {
    return (
      <Card withBorder p="md">
        <Title order={4}>Penggunaan Premium</Title>
        <Text size="sm" c="red">
          Gagal memuat data
        </Text>
      </Card>
    );
  }

  const students = studentsQuery.data || [];
  const premiumStudents = students.filter((student) => student.isPremium);

  // Group premium students by age group
  const premiumByAgeGroup = premiumStudents.reduce(
    (acc, student) => {
      const ageGroup = student.ageGroup || "Tidak diketahui";
      acc[ageGroup] = (acc[ageGroup] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Sort age groups
  const ageGroupOrder = [
    "U7",
    "U9",
    "U11",
    "U13",
    "U15",
    "U17",
    "U20",
    "SENIOR",
    "Tidak diketahui",
  ];
  const sortedAgeGroups = Object.keys(premiumByAgeGroup).sort(
    (a, b) => ageGroupOrder.indexOf(a) - ageGroupOrder.indexOf(b),
  );

  return (
    <Card withBorder shadow="sm" my={10} p="md">
      <Title order={4} mb="md">
        Penggunaan Premium
      </Title>

      <Stack>
        <Text size="sm">
          Total siswa premium: <strong>{premiumStudents.length}</strong> dari{" "}
          {students.length} siswa
        </Text>

        <Title order={5} mt="md">
          Berdasarkan Kelompok Usia
        </Title>

        <Grid>
          {sortedAgeGroups.map((ageGroup) => (
            <Grid.Col span={6} key={ageGroup}>
              <Card withBorder p="xs">
                <Text fw={500}>{ageGroup}</Text>
                <Text size="sm">
                  {premiumByAgeGroup[ageGroup]} siswa premium
                </Text>
              </Card>
            </Grid.Col>
          ))}

          {sortedAgeGroups.length === 0 && (
            <Grid.Col span={12}>
              <Text size="sm" c="dimmed" ta="center">
                Belum ada siswa premium
              </Text>
            </Grid.Col>
          )}
        </Grid>
      </Stack>
    </Card>
  );
}
