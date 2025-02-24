"use client";

import { Button } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getAllLatihanKelompokQueryOptions } from "../../actions/get-all-latihan-kelompok/query-options";

export function DaftarLatihanKelompokView({
  isAdmin = false,
}: {
  isAdmin: boolean;
}) {
  const { data, isLoading } = useQuery(getAllLatihanKelompokQueryOptions());

  return (
    <div className="space-y-10 xl:mt-10 xl:space-y-4">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-xl font-semibold lg:text-2xl">
          Daftar Latihan Kelompok
        </h2>
        {isAdmin && (
          <Link
            href={
              "/dashboard/admin/daftar-latihan-kelompok/tambah-latihan-kelompok"
            }
            className="rounded-lg bg-[#28B826] px-4 py-2 capitalize text-white shadow-xl"
          >
            tambahkan latihan baru
          </Link>
        )}
      </div>
      <div className="space-y-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : data && data.length > 0 ? (
          data.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-start gap-10 rounded-lg border-2 p-8 shadow-lg lg:gap-8 xl:flex-row xl:gap-20"
            >
              <div className="aspect-video overflow-hidden rounded-xl border-2 shadow-lg lg:w-2/3 xl:w-1/3">
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
              <div className="flex flex-col gap-4 xl:w-2/3">
                <p className="font-bold uppercase lg:text-2xl xl:text-xl">
                  {item.name}
                </p>
                <p className="text-justify font-extralight lg:text-xl xl:text-base">
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
                      href={`/dashboard/admin/daftar-latihan-kelompok/edit/${item.id}`}
                      color="green"
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-40 items-center justify-center rounded-lg border-2 text-gray-500">
            Tidak ada data ditemukan
          </div>
        )}
      </div>
    </div>
  );
}
