"use client";

import { Button } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { getAllEnsiklopediPemainQueryOptions } from "../../actions/get-all-ensiklopedi-pemain/query-options";

export function EnsiklopediPosisiPemainView({ isAdmin }: { isAdmin: boolean }) {
  const { data, isLoading } = useQuery(getAllEnsiklopediPemainQueryOptions());

  return (
    <div className="space-y-20">
      <div className="flex flex-row items-center justify-between">
        <p className="text-2xl font-bold uppercase">
          ENSIKLOPEDI POSISI PEMAIN
        </p>
        {isAdmin && (
          <Link
            href={
              "/dashboard/admin/ensiklopedi-posisi-pemain/tambah-ensiklopedi-posisi-pemain"
            }
          >
            <Button className="!bg-green-500 capitalize hover:!bg-green-600 focus-visible:outline-2">
              tambahkan formasi baru
            </Button>
          </Link>
        )}
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid lg:grid-cols-3 lg:gap-24">
          {data &&
            data.map((formasi, index) => (
              <Link
                key={index}
                href={
                  isAdmin
                    ? `/dashboard/admin/ensiklopedi-posisi-pemain/detail-ensiklopedi-posisi-pemain/${formasi.id}`
                    : `/dashboard/ensiklopedi-posisi-pemain/${formasi.id}`
                }
                className="flex justify-center"
              >
                <div className="flex h-[400px] w-[300px] flex-col items-center gap-4 rounded-xl border-2 p-8 shadow-xl">
                  <p className="text-center text-xl font-bold uppercase">
                    formasi {formasi.namaFormasi}
                  </p>
                  <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
                    <Image
                      src={formasi.gambarFormasiDefault || "/formasi.png"}
                      alt="formasi default"
                      width={500}
                      height={500}
                      priority
                      className="h-full w-full rounded-xl object-cover shadow-xl"
                    />
                  </div>
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}
