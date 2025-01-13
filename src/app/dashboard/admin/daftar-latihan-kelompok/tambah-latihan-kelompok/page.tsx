import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import DaftarLatihanKelompokForm from "@/features/daftar-latihan-kelompok/components/form/daftar-latihan-kelompok-form";
import { Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

export default function TambahLatihanKelompok() {
  return (
    <DashboardSectionContainer>
      <Link href={"/dashboard/admin/daftar-latihan-kelompok"}>
        <Button
          className="focus-visible:outline- indigo-600 flex w-32 flex-row items-center justify-center bg-indigo-500 capitalize hover:bg-gray-600"
          leftSection={<IconArrowLeft size={18} />}
        >
          back to daftar latihan kelompok
        </Button>
      </Link>
      <h1 className="my-8 text-2xl font-semibold capitalize">
        metode latihan baru
      </h1>
      <DaftarLatihanKelompokForm />
    </DashboardSectionContainer>
  );
}
