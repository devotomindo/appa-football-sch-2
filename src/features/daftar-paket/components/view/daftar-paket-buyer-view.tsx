"use client";

import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { OrderConfirmationModalContent } from "@/features/transactions/components/modal/order-confirmation-modal";
import { GetUserByIdResponse } from "@/features/user/actions/get-user-by-id";
import { SchoolSession } from "@/lib/session";
import { useSchoolStore } from "@/stores/school-store";
import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  Modal,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
  rem,
} from "@mantine/core";
import { IconCheck, IconUsers } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { GetAllPackagesResponse } from "../../actions/get-all-daftar-paket";
import { getAllPackagesQueryOptions } from "../../actions/get-all-daftar-paket/query-options";

export function DaftarPaketBuyerView({
  userData,
  initialSchoolSession,
}: {
  userData: GetUserByIdResponse;
  initialSchoolSession: SchoolSession | null;
}) {
  const packagesQuery = useQuery(getAllPackagesQueryOptions());
  const { selectedSchool, hydrate, isHydrating } = useSchoolStore();
  const [selectedPackage, setSelectedPackage] = useState<
    GetAllPackagesResponse[number] | null
  >(null);

  // Consider it loading during hydration or when waiting for school info
  const isLoading = isHydrating || !selectedSchool;

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

  if (packagesQuery.isLoading) {
    return (
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl" mt={50}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} height={400} radius="md" />
        ))}
      </SimpleGrid>
    );
  }

  return (
    <Container size="xl">
      <div className="mb-12 text-center">
        <Badge
          variant="filled"
          size="lg"
          radius="xl"
          className="mb-4"
          color="red"
        >
          Paket Kuota Pemain
        </Badge>
        <Title order={1} className="mb-4 text-4xl font-bold">
          Tingkatkan Kapasitas Sekolah Anda
        </Title>
        <Text c="dimmed" className="mx-auto max-w-2xl justify-self-center">
          Pilih paket yang sesuai untuk menambahkan kuota pemain dan akomodasi
          lebih banyak siswa
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
        {packagesQuery.data?.map((pkg) => (
          <Card
            key={pkg.id}
            shadow="md"
            padding="xl"
            radius="md"
            withBorder
            className="transition-all duration-200 hover:shadow-xl"
          >
            <Stack>
              <Group justify="center" mt="md">
                <IconUsers size={48} className="text-red-600" stroke={1.5} />
              </Group>

              <div className="text-center">
                <Text size="xl" fw={700} className="text-red-600">
                  +{pkg.quotaAddition} Pemain
                </Text>
                <Text size="sm" c="dimmed">
                  Tambahan Kapasitas
                </Text>
              </div>

              <Group justify="center" mt="md">
                <Title className="text-center" order={3}>
                  {pkg.name}
                </Title>
              </Group>

              <Badge
                size="xl"
                variant="gradient"
                gradient={{ from: "red", to: "dark" }}
                className="self-center"
              >
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(pkg.price)}
              </Badge>

              <Text size="sm" c="dimmed" className="text-center">
                {pkg.description}
              </Text>

              <div className="mt-4 space-y-2">
                <Group gap="xs" wrap="nowrap">
                  <IconCheck
                    style={{ width: rem(16), height: rem(16) }}
                    className="text-red-600"
                  />
                  <Text size="sm">
                    Berlaku selama {pkg.monthDuration} bulan
                  </Text>
                </Group>
                <Group gap="xs" wrap="nowrap">
                  <IconCheck
                    style={{ width: rem(16), height: rem(16) }}
                    className="text-red-600"
                  />
                  <Text size="sm">
                    Tambah hingga {pkg.quotaAddition} pengguna baru
                  </Text>
                </Group>
                <Group gap="xs" wrap="nowrap">
                  <IconCheck
                    style={{ width: rem(16), height: rem(16) }}
                    className="text-red-600"
                  />
                  <Text size="sm">Akses penuh ke semua fitur</Text>
                </Group>
              </div>

              <Button
                fullWidth
                size="md"
                variant="gradient"
                gradient={{ from: "red", to: "dark" }}
                className="hover:opacity-90"
                onClick={() => {
                  setSelectedPackage(pkg);
                }}
              >
                Pilih Paket
              </Button>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>

      {selectedPackage && (
        <Modal
          opened={selectedPackage !== null}
          onClose={() => setSelectedPackage(null)}
          title={<p className="text-2xl font-bold">Konfirmasi Pesanan</p>}
          centered
        >
          <OrderConfirmationModalContent
            userData={userData}
            schoolSession={selectedSchool}
            packageData={selectedPackage}
          />
        </Modal>
      )}
    </Container>
  );
}
