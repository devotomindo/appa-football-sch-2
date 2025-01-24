"use client";

import { getLatihanByIdQueryOptions } from "@/features/daftar-latihan/actions/get-latihan-by-id/query-options";
import { CreateOrUpdateLatihanForm } from "@/features/daftar-latihan/form/create-or-update-latihan-form";
import { Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export function EditLatihanKelompokView({ latihanId }: { latihanId: string }) {
  const { data, isLoading } = useQuery(getLatihanByIdQueryOptions(latihanId));

  if (isLoading) {
    return <p>loading...</p>;
  }

  return (
    <div className="space-y-8">
      <Link href={"/dashboard/admin/daftar-latihan-kelompok"}>
        <Button
          className="flex w-32 flex-row items-center justify-center !bg-[#E92222] capitalize hover:bg-gray-600"
          leftSection={<IconArrowLeft size={18} />}
        >
          back to daftar latihan kelompok
        </Button>
      </Link>

      <CreateOrUpdateLatihanForm isIndividual={false} latihanData={data} />
    </div>
  );
}
