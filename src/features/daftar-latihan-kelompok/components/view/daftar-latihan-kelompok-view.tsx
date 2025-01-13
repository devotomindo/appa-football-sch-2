"use client";

import Link from "next/link";

export function DaftarLatihanKelompokView() {
  return (
    <div className="mt-10 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Daftar Latihan Kelompok</h2>
        <Link
          href={
            "/dashboard/admin/daftar-latihan-kelompok/tambah-latihan-kelompok"
          }
          className="rounded-lg bg-[#28B826] px-4 py-2 capitalize text-white shadow-xl"
        >
          tambahkan latihan baru
        </Link>
      </div>
      <div className="space-y-4">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="flex items-start gap-20 rounded-lg border-2 p-16 shadow-lg"
          >
            <div className="aspect-video w-1/3 rounded-xl border-2 px-10 py-4 shadow-lg">
              Video
            </div>
            <div className="flex w-2/3 flex-col gap-4">
              <p className="text-xl font-bold uppercase">LATIHAN RONDO 4V1</p>
              <p className="font-extralight capitalize">
                salah satu metode latihan sepak bola yang dilakukan dalam
                lingkaran, di mana sekelompok pemain menguasai bola dan berusaha
                mempertahankan penguasaan bola, sementara pemain lain mencoba
                merebut bola
              </p>
              <Link
                href={`/dashboard/admin/daftar-latihan-kelompok/latihan/${index}`}
                className="w-fit rounded-lg border-2 px-10 py-4 capitalize shadow-xl"
              >
                Selengkapnya
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
