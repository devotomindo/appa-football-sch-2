"use client";

import { Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

export function DetailAsesmenView() {
  return (
    <div className="space-y-8">
      <Link href={"/dashboard/admin/data-asesmen"}>
        <Button
          className="flex w-32 flex-row items-center justify-center bg-indigo-500 capitalize hover:bg-indigo-600 focus-visible:outline-2"
          leftSection={<IconArrowLeft size={18} />}
        >
          back to data asesmen
        </Button>
      </Link>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold uppercase">push up 1 menit</h1>
        <p className="text-xl uppercase text-[#E92222]">fisik</p>
      </div>
      <p className="font-light text-[#333333]">
        Salah satu metode latihan sepak bola yang dilakukan dalam lingkaran, di
        mana sekelompok pemain menguasai bola dan berusaha mempertahankan
        penguasaan bola, sementara pemain lain mencoba merebut bola
      </p>
      <h2 className="text-xl font-bold capitalize">tujuan asesmen</h2>
      <p className="font-extralight">
        Salah satu metode latihan sepak bola yang dilakukan dalam lingkaran, di
        mana sekelompok pemain menguasai bola dan berusaha mempertahankan
        penguasaan bola, sementara pemain lain mencoba merebut bola.Salah satu
        metode latihan sepak bola yang dilakukan dalam lingkaran, di mana
        sekelompok pemain menguasai bola dan berusaha mempertahankan penguasaan
        bola, sementara pemain lain mencoba merebut bola.Salah satu metode
        latihan sepak bola yang dilakukan dalam lingkaran, di mana sekelompok
        pemain menguasai bola dan berusaha mempertahankan penguasaan bola,
        sementara pemain lain mencoba merebut bola
      </p>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div className="rounded-xl border-2 shadow-xl" key={i}>
            <div className="flex items-start p-6">
              <div className="w-1/3">
                <div className="relative h-40 w-40 overflow-hidden rounded-xl border-2 shadow-xl">
                  <Image
                    src={"/push-up.png"}
                    alt=""
                    width={500}
                    height={500}
                    className="h-full w-full rounded-xl object-cover shadow-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xl font-bold capitalize">langkah #{i + 1}</p>
                <p className="font-extralight">
                  Salah satu metode latihan sepak bola yang dilakukan dalam
                  lingkaran, di mana sekelompok pemain menguasai bola dan
                  berusaha mempertahankan penguasaan bola,{" "}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
