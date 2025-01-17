"use client";

import { Button } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";

export function EnsiklopediPosisiPemainView() {
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
      <div className="grid lg:grid-cols-3 lg:gap-24">
        {[...Array(8)].map((_, index) => (
          <Link
            key={index}
            href={`/dashboard/admin/ensiklopedi-posisi-pemain/detail-ensiklopedi-posisi-pemain/${index + 1}`}
          >
            <div className="space-y-4 rounded-xl border-2 p-12 shadow-xl">
              <p className="text-center text-xl font-bold uppercase">
                formasi 4-3-3
              </p>
              <div className="relative">
                <Image
                  src={"/formasi.png"}
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
    </div>
  );
}
