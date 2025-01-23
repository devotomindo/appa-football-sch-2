import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { AsesmenPemainProForm } from "@/features/data-asesmen/components/form/asesmen-pemain-pro-form/asesmen-pemain-pro-form";
import { Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

export default async function CreateAsesmenPemainPro() {
  const idPemainPro = "1";

  return (
    <DashboardSectionContainer>
      <Link
        href={`/dashboard/admin/data-asesmen/detail-pemain-pro/${idPemainPro}`}
      >
        <Button
          className="flex w-32 flex-row items-center justify-center bg-indigo-500 capitalize hover:bg-indigo-600 focus-visible:outline-2"
          leftSection={<IconArrowLeft size={18} />}
        >
          back to data asesmen pemain pro
        </Button>
      </Link>
      <h1 className="my-8 text-2xl font-bold uppercase">create asesmen</h1>
      <AsesmenPemainProForm />
    </DashboardSectionContainer>
  );
}
