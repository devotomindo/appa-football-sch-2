import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { EnsiklopediPosisiPemainForm } from "@/features/ensiklopedi-posisi-pemain/components/form/ensiklopedi-posisi-pemain-form";
import { Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

export default function TambahEnsiklopediPosisiPemain() {
  return (
    <DashboardSectionContainer>
      <Link href={"/dashboard/admin/ensiklopedi-posisi-pemain"}>
        <Button
          className="flex w-32 flex-row items-center justify-center bg-indigo-500 capitalize hover:bg-indigo-600 focus-visible:outline-2"
          leftSection={<IconArrowLeft size={18} />}
        >
          back to ensiklopedi posisi pemain
        </Button>
      </Link>
      <h1 className="my-8 text-2xl font-semibold capitalize">formasi baru</h1>
      <EnsiklopediPosisiPemainForm />
    </DashboardSectionContainer>
  );
}
