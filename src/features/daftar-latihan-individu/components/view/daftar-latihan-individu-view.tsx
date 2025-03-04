"use client";

import { getAllLatihanIndividuQueryOptions } from "@/features/daftar-latihan/actions/get-all-latihan-individu/query-options";
import { Button } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export function DaftarLatihanIndividuView({
  isAdmin = false,
}: {
  isAdmin: boolean;
}) {
  const { data, isLoading } = useQuery(getAllLatihanIndividuQueryOptions());

  return (
    <div className="space-y-10 xl:mt-10 xl:space-y-4">
      <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-xl font-semibold lg:text-2xl">
          Daftar Latihan Individu
        </h2>
        {isAdmin && (
          <Link
            href={
              "/dashboard/admin/daftar-latihan-individu/tambah-latihan-individu"
            }
            className="w-full rounded-lg bg-[#28B826] px-4 py-2.5 text-center text-sm font-medium capitalize text-white shadow-xl transition-all hover:bg-[#229A20] sm:w-auto sm:text-base lg:px-6 lg:py-3"
          >
            tambahkan latihan baru
          </Link>
        )}
      </div>
      <div className="space-y-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : data && data.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {data.map((item, index) => (
              <div key={index} className="flex flex-col gap-4">
                <div className="aspect-video overflow-hidden rounded-xl border-2 shadow-lg">
                  {item.videoUrl ? (
                    <video
                      src={item.videoUrl}
                      controls
                      className="h-full w-full object-cover"
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      No video available
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-4">
                  <p className="font-bold uppercase lg:text-xl">{item.name}</p>
                  <p className="text-justify font-extralight lg:text-base">
                    {item.description.length > 200
                      ? `${item.description.slice(0, 200)}...`
                      : item.description}
                  </p>
                  <div className="flex gap-4">
                    <Button
                      component={Link}
                      href={`/dashboard/latihan/${item.id}`}
                    >
                      Selengkapnya
                    </Button>
                    {isAdmin && (
                      <Button
                        component={Link}
                        href={`/dashboard/admin/daftar-latihan-individu/edit/${item.id}`}
                        color="green"
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center rounded-lg border-2 text-gray-500">
            Tidak ada data ditemukan
          </div>
        )}
      </div>
    </div>
  );
}
