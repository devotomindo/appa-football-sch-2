"use client";

import { getLatihanByIdQueryOptions } from "@/features/daftar-latihan/actions/get-latihan-by-id/query-options";
import { Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

export function DetailLatihanView({
  latihanId,
  isAdmin = false,
  roles,
}: {
  latihanId: string;
  isAdmin: boolean;
  roles?: string;
}) {
  const { data, isLoading } = useQuery(getLatihanByIdQueryOptions(latihanId));

  if (isLoading) {
    return <p>loading...</p>;
  }

  const isKelompok = data?.groupSize && data.groupSize > 1;

  return (
    <div className="space-y-8">
      <Button
        component={Link}
        href={
          isAdmin
            ? isKelompok
              ? "/dashboard/admin/daftar-latihan-kelompok"
              : "/dashboard/admin/daftar-latihan-individu"
            : roles?.includes("athlete")
              ? isKelompok
                ? "/dashboard/metode-latihan-kelompok"
                : "/dashboard/metode-latihan-individu"
              : isKelompok
                ? "/dashboard/metode-latihan-kelompok"
                : "/dashboard/metode-latihan-individu"
        }
        className="flex w-32 flex-row items-center justify-center !bg-[#E92222] capitalize"
        leftSection={<IconArrowLeft size={18} />}
      >
        {isKelompok
          ? "back to daftar latihan kelompok"
          : "back to daftar latihan individu"}
      </Button>
      <p className="text-2xl font-bold uppercase">{data?.name}</p>
      <div className="flex flex-col items-start gap-10">
        <div className="relative aspect-video rounded-lg md:w-2/3 xl:w-1/2">
          <video src={data?.videoUrl} controls className="w-full rounded-lg" />
        </div>
        <div className="w-1/2 space-y-4">
          <p className="font-extralight">{data?.description}</p>
          {data?.groupSize && data.groupSize > 1 && (
            <div>
              <p className="text-lg font-bold capitalize">jumlah peserta</p>
              <p className="font-extralight">{data.groupSize}</p>
            </div>
          )}
        </div>
      </div>
      <div className="space-y-4">
        <p className="text-lg font-bold capitalize">kebutuhan alat</p>
        <div className="flex gap-4">
          {data?.tools.map((tool, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-4 rounded-lg border p-5"
            >
              {tool.imageUrl && tool.name ? (
                <div className="relative flex h-28 w-48 items-center justify-center overflow-hidden rounded-lg">
                  <Image
                    src={tool.imageUrl}
                    alt={tool.name}
                    width={200}
                    height={200}
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="relative flex h-28 w-48 items-center justify-center overflow-hidden rounded-lg">
                  <Image
                    src={
                      "https://academy-sb.appa-tech.com/storage/v1/object/public/assets/no-image-placeholder.webp"
                    }
                    alt={tool.name ?? "No image"}
                    width={200}
                    height={200}
                    className="object-cover"
                  />
                </div>
              )}
              <p className="font-bold capitalize">{tool.name}</p>
              <p>Jumlah Dibutuhkan: {tool.minCount}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <p className="text-lg font-bold capitalize">langkah-langkah</p>
        {data?.procedure.map((proc, index) => (
          <div
            key={index}
            className="space-y-4 rounded-lg border-2 p-6 shadow-lg"
          >
            <p className="font-bold capitalize">langkah #{index + 1}</p>
            <p className="font-extralight">{proc} </p>
          </div>
        ))}
      </div>
    </div>
  );
}
