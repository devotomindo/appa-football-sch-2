"use client";

import { getAllLatihanIndividuQueryOptions } from "@/features/daftar-latihan/actions/get-all-latihan-individu/query-options";
import { Button } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export function DaftarLatihanIndividuView({
  isAdmin = false,
  studentId,
}: {
  isAdmin: boolean;
  studentId?: string;
}) {
  const { data, isLoading } = useQuery(
    getAllLatihanIndividuQueryOptions(studentId),
  );

  return (
    <div className="mt-10 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Daftar Latihan Individu</h2>
        {isAdmin && (
          <Link
            href={
              "/dashboard/admin/daftar-latihan-individu/tambah-latihan-individu"
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
              className="flex items-start gap-20 rounded-lg border-2 p-8 shadow-lg"
            >
              <div className="aspect-video w-1/3 overflow-hidden rounded-xl border-2 shadow-lg">
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
              <div className="flex w-2/3 flex-col gap-4">
                <p className="text-xl font-bold uppercase">{item.name}</p>
                <p className="text-justify font-extralight">
                  {item.description.length > 200
                    ? `${item.description.slice(0, 200)}...`
                    : item.description}
                </p>
                <div className="flex gap-4">
                  <Button
                    component={Link}
                    href={
                      isAdmin
                        ? `/dashboard/admin/daftar-latihan-individu/latihan/${item.id}`
                        : `/dashboard/latihan/${item.id}`
                    }
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
