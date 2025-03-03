"use client";

import { getActiveTransactionsBySchoolIdQueryOptions } from "@/features/school/action/get-active-transactions-by-school-id/query-options";
import { Badge, Card, Group, Table, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

export function ActiveSubscriptionsDisplay({ schoolId }: { schoolId: string }) {
  const transactionsQuery = useQuery(
    getActiveTransactionsBySchoolIdQueryOptions(schoolId),
  );

  if (transactionsQuery.isLoading) {
    return (
      <Card withBorder p="md">
        <Title order={4}>Paket Premium Aktif</Title>
        <Text size="sm">Memuat data paket...</Text>
      </Card>
    );
  }

  if (transactionsQuery.isError) {
    return (
      <Card withBorder p="md">
        <Title order={4}>Paket Premium Aktif</Title>
        <Text size="sm" c="red">
          Gagal memuat data paket
        </Text>
      </Card>
    );
  }

  const activeTransactions = transactionsQuery.data || [];

  if (activeTransactions.length === 0) {
    return (
      <Card withBorder shadow="sm" my={10} p="md">
        <Title order={4}>Paket Premium Aktif</Title>
        <Text mt="md" size="sm">
          Tidak ada paket premium aktif saat ini.
        </Text>
      </Card>
    );
  }

  return (
    <Card withBorder shadow="sm" p="md">
      <Title order={4} mb="md">
        Paket Premium Aktif
      </Title>

      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nama Paket</Table.Th>
            <Table.Th>Kuota</Table.Th>
            <Table.Th>Tanggal Pembelian</Table.Th>
            <Table.Th>Tanggal Kedaluwarsa</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {activeTransactions.map((transaction) => (
            <Table.Tr key={transaction.id}>
              <Table.Td>{transaction.packageName}</Table.Td>
              <Table.Td>{transaction.quota}</Table.Td>
              <Table.Td>
                {new Date(transaction.purchaseDate).toLocaleDateString("id-ID")}
              </Table.Td>
              <Table.Td>
                {new Date(transaction.expiryDate).toLocaleDateString("id-ID")}
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <Badge
                    color={
                      transaction.daysRemaining > 30
                        ? "green"
                        : transaction.daysRemaining > 7
                          ? "yellow"
                          : "red"
                    }
                  >
                    {transaction.daysRemaining} hari tersisa
                  </Badge>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Card>
  );
}
