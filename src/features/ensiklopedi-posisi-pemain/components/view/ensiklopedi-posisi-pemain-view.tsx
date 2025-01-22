"use client";

import { Button } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { getAllEnsiklopediPemainQueryOptions } from "../../actions/get-all-ensiklopedi-pemain/query-options";

export function EnsiklopediPosisiPemainView() {
  const { data, isLoading } = useQuery(getAllEnsiklopediPemainQueryOptions());

  return (
    <div className="space-y-20">
      <div className="flex flex-row items-center justify-between">
        <p className="text-2xl font-bold uppercase">
          ENSIKLOPEDI POSISI PEMAIN
        </p>
        <Link
          href={
            "/dashboard/admin/ensiklopedi-posisi-pemain/tambah-ensiklopedi-posisi-pemain"
          }
        >
          <Button className="!bg-green-500 capitalize hover:!bg-green-600 focus-visible:outline-2">
            tambahkan formasi baru
          </Button>
        </Link>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid lg:grid-cols-3 lg:gap-24">
          {data &&
            data.map((formasi, index) => (
              <Link
                key={index}
                href={`/dashboard/admin/ensiklopedi-posisi-pemain/detail-ensiklopedi-posisi-pemain/${formasi.id}`}
              >
                <div className="space-y-4 rounded-xl border-2 p-12 shadow-xl">
                  <p className="text-center text-xl font-bold uppercase">
                    formasi {formasi.name}
                  </p>
                  <div className="relative">
                    <Image
                      src={formasi.defaultFormationImagePath || "/formasi.png"}
                      alt=""
                      width={500}
                      height={500}
                      className=""
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
