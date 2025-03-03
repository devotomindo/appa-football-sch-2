"use client";

import { getPremiumQuotaBySchoolIdQueryOptions } from "@/features/school/action/get-premium-quota-by-school-id/query-options";
import { Alert, Card, Progress, Text, Title } from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";

export function PremiumQuotaDisplay({ schoolId }: { schoolId: string }) {
  const quotaQuery = useQuery(getPremiumQuotaBySchoolIdQueryOptions(schoolId));

  if (quotaQuery.isLoading) {
    return (
      <Card withBorder p="md">
        <Title order={4}>Kuota Premium</Title>
        <Text size="sm">Memuat data kuota...</Text>
      </Card>
    );
  }

  if (quotaQuery.isError) {
    return (
      <Card withBorder p="md">
        <Title order={4}>Kuota Premium</Title>
        <Text size="sm" c="red">
          Gagal memuat data kuota
        </Text>
      </Card>
    );
  }

  if (!quotaQuery.data) {
    return (
      <Card withBorder p="md">
        <Title order={4}>Kuota Premium</Title>
        <Text size="sm" c="red">
          Data kuota tidak ditemukan
        </Text>
      </Card>
    );
  }

  const { totalQuota, usedQuota, availableQuota } = quotaQuery.data;
  const progressPercentage =
    totalQuota > 0 ? (usedQuota / totalQuota) * 100 : 0;

  return (
    <Card withBorder shadow="sm" my={10} p="md">
      <Title order={4}>Kuota Premium</Title>

      {totalQuota === 0 ? (
        <Alert
          icon={<IconAlertTriangle size="1rem" />}
          title="Tidak memiliki kuota aktif"
          color="yellow"
          mt="md"
        >
          Anda tidak memiliki kuota premium aktif. Paket premium Anda mungkin
          telah kedaluwarsa.
        </Alert>
      ) : (
        <>
          <Text size="sm" mt="xs">
            Tersedia: <strong>{availableQuota}</strong> dari total {totalQuota}{" "}
            kuota
          </Text>
          <Progress
            value={progressPercentage}
            mt="md"
            size="md"
            color={availableQuota > 0 ? "green" : "red"}
          />
          <Text size="xs" mt="xs" c="dimmed">
            {usedQuota} kuota telah digunakan
          </Text>
          {availableQuota === 0 && totalQuota > 0 && (
            <Alert
              icon={<IconAlertTriangle size="1rem" />}
              title="Kuota Habis"
              color="red"
              mt="md"
              variant="light"
            >
              Kuota premium Anda telah habis digunakan. Silakan beli paket baru
              untuk menambah kuota.
            </Alert>
          )}
        </>
      )}
    </Card>
  );
}
