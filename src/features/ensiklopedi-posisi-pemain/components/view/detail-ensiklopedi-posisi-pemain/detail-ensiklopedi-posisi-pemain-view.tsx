"use client";

import { Accordion, Button } from "@mantine/core";
import { IconArrowLeft, IconTriangleInvertedFilled } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

interface DaftarPosisi {
  idPosisi: string;
  namaPosisi: string;
  karakteristik: string[] | null;
  deskripsiOffense: string[] | null;
  gambarOffense: string | null;
  deskripsiDefense: string[] | null;

  gambarDefense: string | null;
}

interface DetailEnsiklopediInterface {
  namaFormasi: string;
  gambarFormasiDefault: string;
  gambarOffense: string;
  gambarDefense: string;
  deskripsiFormasi: string | null;
  daftarPosisi: DaftarPosisi[];
}

export function DetailEnsiklopediPosisiPemainView({
  data,
}: {
  data: DetailEnsiklopediInterface;
}) {
  const items = data.daftarPosisi.map((posisi, index) => {
    return (
      <Accordion.Item key={posisi.idPosisi} value={`Posisi #${index + 1}`}>
        <Accordion.Control
          className=""
          classNames={{
            label: "!font-bold ",
          }}
        >{`Posisi #${index + 1}`}</Accordion.Control>
        <Accordion.Panel>
          <div className="space-y-2">
            <div className="flex w-1/4 justify-start rounded-xl border-2 p-4 shadow-lg">
              <p>{posisi.namaPosisi}</p>
            </div>
          </div>
        </Accordion.Panel>
        <Accordion.Panel>
          <div className="space-y-2">
            <p className="text-lg font-bold capitalize">
              karakter yang harus dimiliki
            </p>
            {posisi.karakteristik?.map((karakter, index) => (
              <div
                key={index}
                className="w flex justify-start rounded-xl border-2 p-4 shadow-lg"
              >
                <p className="">{karakter}</p>
              </div>
            ))}
          </div>
        </Accordion.Panel>
        <Accordion.Panel>
          <div className="space-y-2">
            <p className="text-lg font-bold capitalize">
              posisi ketika menyerang
            </p>
            <div className="relative h-96 w-full">
              {posisi.gambarOffense && (
                <Image
                  src={posisi.gambarOffense}
                  alt="formasi-offense"
                  width={500}
                  height={500}
                  className="h-full w-fit rounded-lg object-contain"
                />
              )}
            </div>
            {posisi.deskripsiOffense?.map((deskripsi, index) => (
              <div
                key={index}
                className="w flex justify-start rounded-xl border-2 p-4 shadow-lg"
              >
                <p>{deskripsi}</p>
              </div>
            ))}
          </div>
        </Accordion.Panel>
        <Accordion.Panel>
          <div className="space-y-2">
            <p className="text-lg font-bold capitalize">
              posisi ketika bertahan
            </p>
            <div className="relative h-96 w-full">
              {posisi.gambarDefense && (
                <Image
                  src={posisi.gambarDefense}
                  alt="formasi-offense"
                  width={500}
                  height={500}
                  className="h-full w-fit rounded-lg object-contain"
                />
              )}
            </div>
            {posisi.deskripsiDefense?.map((deskripsi, index) => (
              <div
                key={index}
                className="w flex justify-start rounded-xl border-2 p-4 shadow-lg"
              >
                <p>{deskripsi}</p>
              </div>
            ))}
          </div>
        </Accordion.Panel>
      </Accordion.Item>
    );
  });

  return (
    <div className="space-y-8">
      <Link href={"/dashboard/admin/ensiklopedi-posisi-pemain"}>
        <Button
          className="flex w-32 flex-row items-center justify-center bg-indigo-500 capitalize hover:bg-indigo-600 focus-visible:outline-2"
          leftSection={<IconArrowLeft size={18} />}
        >
          back to daftar ensiklopedi posisi pemain
        </Button>
      </Link>
      <h1 className="text-2xl font-bold uppercase">
        formasi {data.namaFormasi}
      </h1>
      <div className="flex justify-start gap-4">
        <div className="w-1/5">
          <p className="font-bold capitalize">formasi asli</p>
          <div className="relative">
            <Image
              src={data.gambarFormasiDefault}
              alt="formasi-default"
              width={500}
              height={500}
              className=""
            />
          </div>
        </div>
        <div className="w-1/5">
          <p className="font-bold capitalize">transisi menyerang</p>
          <div className="relative">
            <Image
              src={data.gambarOffense}
              alt="formasi-offense"
              width={500}
              height={500}
              className=""
            />
          </div>
        </div>
        <div className="w-1/5">
          <p className="font-bold capitalize">transisi defense</p>
          <div className="relative">
            <Image
              src={data.gambarDefense}
              alt="formasi-defense"
              width={500}
              height={500}
              className=""
            />
          </div>
        </div>
      </div>
      <p className="font-light">{data.deskripsiFormasi}</p>
      <Accordion
        variant="separated"
        defaultValue="Posisi #1"
        radius={"md"}
        className="chevron"
        chevron={<IconTriangleInvertedFilled className={"icon"} />}
      >
        <p className="mb-2 font-bold capitalize">daftar posisi</p>
        {items}
      </Accordion>
    </div>
  );
}
