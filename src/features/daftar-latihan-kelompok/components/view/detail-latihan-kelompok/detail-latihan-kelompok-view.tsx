"use client";

import { Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

export function DetailLatihanKelompokView() {
  return (
    <div className="space-y-8">
      <Link href={"/dashboard/admin/daftar-latihan-kelompok"}>
        <Button
          className="focus-visible:outline- indigo-600 flex w-32 flex-row items-center justify-center bg-indigo-500 capitalize hover:bg-gray-600"
          leftSection={<IconArrowLeft size={18} />}
        >
          back to daftar latihan kelompok
        </Button>
      </Link>
      <p className="text-2xl font-bold uppercase">latihan rondo 4v1</p>
      <div className="flex items-start gap-10">
        <div className="relative w-[1500px]">
          <Image
            src={"/rondo.png"}
            alt=""
            width={500}
            height={500}
            className="rounded-lg"
          />
        </div>
        <p className="font-extralight">
          Salah satu metode latihan sepak bola yang dilakukan dalam lingkaran,
          di mana sekelompok pemain menguasai bola dan berusaha mempertahankan
          penguasaan bola, sementara pemain lain mencoba merebut bola
        </p>
      </div>
      <div className="space-y-4">
        <p className="text-lg font-bold capitalize">kebutuhan alat</p>
        <p className="font-extralight">
          Salah satu metode latihan sepak bola yang dilakukan dalam lingkaran,
          di mana sekelompok pemain menguasai bola dan berusaha mempertahankan
          penguasaan bola, sementara pemain lain mencoba merebut bola.Salah satu
          metode latihan sepak bola yang dilakukan dalam lingkaran, di mana
          sekelompok pemain menguasai bola dan berusaha mempertahankan
          penguasaan bola, sementara pemain lain mencoba merebut bola.Salah satu
          metode latihan sepak bola yang dilakukan dalam lingkaran, di mana
          sekelompok pemain menguasai bola dan berusaha mempertahankan
          penguasaan bola, sementara pemain lain mencoba merebut bola
        </p>
      </div>
      <div className="space-y-4">
        <p className="text-lg font-bold capitalize">langkah-langkah</p>
        {[...Array(3)].map((_, index) => (
          <div key={index} className="rounded-lg p-12 shadow-lg">
            <p className="font-bold capitalize">langkah #{index}</p>
            <p className="font-extralight">
              Salah satu metode latihan sepak bola yang dilakukan dalam
              lingkaran, di mana sekelompok pemain menguasai bola dan berusaha
              mempertahankan penguasaan bola,{" "}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
