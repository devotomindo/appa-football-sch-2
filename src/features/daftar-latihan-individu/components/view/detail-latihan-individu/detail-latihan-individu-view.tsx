"use client";

import { trainingProcedure } from "@/db/drizzle/schema";
import { Badge, Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { InferSelectModel } from "drizzle-orm";
import Link from "next/link";

export function DetailLatihanIndividuView({
  data,
}: {
  data: InferSelectModel<typeof trainingProcedure>;
}) {
  return (
    <div className="space-y-8">
      <Link href={"/dashboard/admin/daftar-latihan-individu"}>
        <Button
          className="flex w-32 flex-row items-center justify-center !bg-[#E92222] capitalize hover:bg-gray-600"
          leftSection={<IconArrowLeft size={18} />}
        >
          back to daftar latihan individu
        </Button>
      </Link>
      <p className="text-2xl font-bold uppercase">{data?.name}</p>
      <div className="flex items-start gap-10">
        <div className="relative aspect-video w-1/2 rounded-lg border-2 shadow-lg">
          <video src={data.videoPath} controls className="w-full rounded-lg" />
        </div>
        <div className="w-1/2 space-y-4">
          <p className="font-extralight">{data?.description}</p>
        </div>
      </div>
      <div className="space-y-4">
        <p className="text-lg font-bold capitalize">kebutuhan alat</p>
        <div className="flex gap-4">
          {data?.tools.map((tool, index) => (
            <Badge color="#E92222" key={index} size="lg">
              {tool}
            </Badge>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <p className="text-lg font-bold capitalize">langkah-langkah</p>
        {data?.procedure.map((proc, index) => (
          <div
            key={index}
            className="space-y-4 rounded-lg border-2 p-12 shadow-lg"
          >
            <p className="font-bold capitalize">langkah #{index + 1}</p>
            <p className="font-extralight">{proc}, </p>
          </div>
        ))}
      </div>
    </div>
  );
}
