import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { CreateOrUpdateLatihanForm } from "@/features/daftar-latihan/form/create-or-update-latihan-form";
import { Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

export default function TambahLatihanKelompok() {
  return (
    <DashboardSectionContainer>
      <Link href={"/dashboard/admin/daftar-latihan-kelompok"}>
        <Button
          className="flex w-1/4 flex-row items-center justify-center bg-indigo-600 text-xs capitalize hover:bg-gray-600 focus-visible:outline-1"
          leftSection={<IconArrowLeft size={18} />}
        >
          back to daftar latihan kelompok
        </Button>
      </Link>
      <h1 className="my-8 text-2xl font-semibold capitalize">
        metode latihan baru
      </h1>
      <CreateOrUpdateLatihanForm isIndividual={false} />
    </DashboardSectionContainer>
  );
}
