import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { CreateOrUpdateLatihanForm } from "@/features/daftar-latihan/form/create-or-update-latihan-form";
import { Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

export default function TambahLatihanIndividu() {
  return (
    <DashboardSectionContainer>
      <Link href={"/dashboard/admin/daftar-latihan-individu"}>
        <Button
          className="flex w-32 flex-row items-center justify-center bg-indigo-500 capitalize hover:bg-indigo-600 focus-visible:outline-2"
          leftSection={<IconArrowLeft size={18} />}
        >
          back to daftar latihan individu
        </Button>
      </Link>
      <h1 className="my-8 text-2xl font-semibold capitalize">
        metode latihan baru
      </h1>
      <CreateOrUpdateLatihanForm isIndividual={true} />
    </DashboardSectionContainer>
  );
}
