"use client";

import { Button, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getAllEnsiklopediPemainQueryOptions } from "../../actions/get-all-ensiklopedi-pemain/query-options";

export function EnsiklopediPosisiPemainView({ isAdmin }: { isAdmin: boolean }) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading } = useQuery(getAllEnsiklopediPemainQueryOptions());

  const filteredData = data?.filter((formasi) =>
    formasi.namaFormasi?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-16 sm:space-y-10 xl:space-y-10">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-between sm:gap-20 xl:flex-row xl:items-center xl:justify-between">
          {/* title */}
          <p className="text-center text-2xl font-bold uppercase sm:text-xl md:text-lg lg:text-xl">
            ENSIKLOPEDI POSISI PEMAIN
          </p>
          {/* button */}
          {isAdmin && (
            <Link
              href={
                "/dashboard/admin/ensiklopedi-posisi-pemain/tambah-ensiklopedi-posisi-pemain"
              }
              className="w-full sm:w-auto"
            >
              <Button className="h-full w-full !bg-green-500 capitalize hover:!bg-green-600 focus-visible:outline-2">
                tambahkan formasi baru
              </Button>
            </Link>
          )}
        </div>
      </div>
      <div className="">
        <TextInput
          placeholder="Cari formasi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftSection={<IconSearch size={16} />}
          className="mx-auto xl:mx-0 xl:max-w-lg"
        />
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 md:gap-5 lg:gap-8 xl:grid-cols-4 xl:gap-8">
          {filteredData && filteredData.length > 0 ? (
            filteredData.map((formasi, index) => (
              <Link
                key={index}
                href={
                  isAdmin
                    ? `/dashboard/admin/ensiklopedi-posisi-pemain/detail-ensiklopedi-posisi-pemain/${formasi.id}`
                    : `/dashboard/ensiklopedi-posisi-pemain/${formasi.id}`
                }
                className="flex justify-center"
              >
                <div className="flex flex-col items-center gap-4 rounded-xl border-2 p-8 shadow-xl">
                  <p className="min-h-10 text-center font-bold uppercase md:text-sm lg:text-base xl:min-h-16 xl:text-lg 2xl:min-h-10">
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
            ))
          ) : (
            <div className="col-span-3 flex justify-center">
              <p className="text-lg text-gray-500">
                Formasi {searchQuery ? `"${searchQuery}" ` : ""}tidak ditemukan
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
