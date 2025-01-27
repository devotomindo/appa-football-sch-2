import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { TambahPemainProForm } from "@/features/data-asesmen/components/form/tambah-pemain-pro-form/tambah-pemain-pro-form";
import { Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

export default function TambahPemainPro() {
  return (
    <DashboardSectionContainer>
      <Link href={"/dashboard/admin/data-asesmen"}>
        <Button
          className="flex w-32 flex-row items-center justify-center capitalize hover:bg-gray-600"
          leftSection={<IconArrowLeft size={18} />}
        >
          back to data asesmen
        </Button>
      </Link>
      <h1 className="my-8 text-2xl font-bold capitalize">data asesmen baru</h1>
      <TambahPemainProForm />
    </DashboardSectionContainer>
  );
}
