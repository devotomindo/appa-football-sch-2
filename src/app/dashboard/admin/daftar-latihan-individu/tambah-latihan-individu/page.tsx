import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { DaftarLatihanIndividuForm } from "@/features/daftar-latihan-individu/components/form/daftar-latihan-individu-form";
import { Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

export default function TambahLatihanIndividu() {
  return (
    <DashboardSectionContainer>
      <Link href={"/dashboard/admin/daftar-latihan-individu"}>
        <Button
          className="focus-visible:outline- indigo-600 flex w-32 flex-row items-center justify-center bg-indigo-500 capitalize hover:bg-gray-600"
          leftSection={<IconArrowLeft size={18} />}
        >
          back to daftar latihan individu
        </Button>
      </Link>
      <h1 className="my-8 text-2xl font-semibold capitalize">
        metode latihan baru
      </h1>
      <DaftarLatihanIndividuForm />
    </DashboardSectionContainer>
  );
}
