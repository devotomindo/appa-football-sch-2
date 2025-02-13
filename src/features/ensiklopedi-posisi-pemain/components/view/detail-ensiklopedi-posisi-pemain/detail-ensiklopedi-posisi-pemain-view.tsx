"use client";

import { getEnsiklopediByIdQueryOptions } from "@/features/ensiklopedi-posisi-pemain/actions/get-ensiklopedi-by-id/query-options";
import { Accordion, Button, Modal } from "@mantine/core";
import {
  IconArrowLeft,
  IconEdit,
  IconTrash,
  IconTriangleInvertedFilled,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteEnsiklopediForm } from "../../form/delete-ensiklopedi-form";

export function DetailEnsiklopediPosisiPemainView({
  id,
  isAdmin,
}: {
  id: string;
  isAdmin: boolean;
}) {
  const { data, isLoading } = useQuery(getEnsiklopediByIdQueryOptions(id));
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const router = useRouter();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const items = data?.daftarPosisi.map((posisi, index) => {
    return (
      <Accordion.Item key={posisi.idPosisi} value={`Posisi #${index + 1}`}>
        <Accordion.Control
          className=""
          classNames={{
            label: "!font-bold ",
          }}
        >{`Posisi #${index + 1}`}</Accordion.Control>
        {posisi.namaPosisi && (
          <Accordion.Panel>
            <div className="space-y-2">
              <div className="flex w-1/4 justify-start rounded-xl border-2 p-4 shadow-lg">
                <p>{posisi.namaPosisi}</p>
              </div>
              <div className="rounded-md bg-gray-600 p-2 text-sm text-white">
                {posisi.deskripsiPosisi}
              </div>
            </div>
          </Accordion.Panel>
        )}
        {posisi.karakteristik && posisi.karakteristik.length > 0 && (
          <Accordion.Panel>
            <div className="space-y-2">
              <p className="text-lg font-bold capitalize">
                karakter yang harus dimiliki
              </p>
              {posisi.karakteristik.map((karakter, index) => (
                <div
                  key={index}
                  className="w flex justify-start rounded-xl border-2 p-4 shadow-lg"
                >
                  <p className="">{karakter}</p>
                </div>
              ))}
            </div>
          </Accordion.Panel>
        )}
        {(posisi.gambarOffense ||
          (posisi.deskripsiOffense && posisi.deskripsiOffense.length > 0)) && (
          <Accordion.Panel>
            <div className="space-y-2">
              <p className="text-lg font-bold capitalize">
                posisi ketika menyerang
              </p>
              {posisi.gambarOffense && (
                <div className="relative h-96 w-full">
                  <Image
                    src={posisi.gambarOffense}
                    alt="formasi-offense"
                    width={500}
                    height={500}
                    className="h-full w-fit rounded-lg object-contain"
                  />
                </div>
              )}
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
        )}
        {(posisi.gambarDefense ||
          (posisi.deskripsiDefense && posisi.deskripsiDefense.length > 0)) && (
          <Accordion.Panel>
            <div className="space-y-2">
              <p className="text-lg font-bold capitalize">
                posisi ketika bertahan
              </p>
              {posisi.gambarDefense && (
                <div className="relative h-96 w-full">
                  <Image
                    src={posisi.gambarDefense}
                    alt="formasi-offense"
                    width={500}
                    height={500}
                    className="h-full w-fit rounded-lg object-contain"
                  />
                </div>
              )}
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
        )}
      </Accordion.Item>
    );
  });

  return (
    <div className="space-y-8">
      <Link
        href={
          isAdmin
            ? "/dashboard/admin/ensiklopedi-posisi-pemain"
            : "/dashboard/ensiklopedi-posisi-pemain"
        }
      >
        <Button
          className="flex w-32 flex-row items-center justify-center bg-indigo-500 capitalize hover:bg-indigo-600 focus-visible:outline-2"
          leftSection={<IconArrowLeft size={18} />}
        >
          back to daftar ensiklopedi posisi pemain
        </Button>
      </Link>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold uppercase">
          formasi {data?.namaFormasi}
        </h1>
        {isAdmin && (
          <div className="space-x-4">
            <Link
              href={`/dashboard/admin/ensiklopedi-posisi-pemain/detail-ensiklopedi-posisi-pemain/${id}/edit`}
            >
              <Button
                className="flex w-32 flex-row items-center justify-center bg-indigo-500 capitalize hover:bg-indigo-600 focus-visible:outline-2"
                rightSection={<IconEdit size={18} />}
              >
                Edit
              </Button>
            </Link>
            <Button
              className="flex w-32 flex-row items-center justify-center !bg-red-500 capitalize hover:!bg-red-600 focus-visible:outline-2"
              rightSection={<IconTrash size={18} />}
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Hapus
            </Button>
          </div>
        )}
      </div>
      <div className="flex justify-start gap-4">
        <div className="w-1/5">
          <p className="font-bold capitalize">formasi asli</p>
          <div className="relative">
            <Image
              src={data?.gambarFormasiDefault || ""}
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
              src={data?.gambarOffense || ""}
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
              src={data?.gambarDefense || ""}
              alt="formasi-defense"
              width={500}
              height={500}
              className=""
            />
          </div>
        </div>
      </div>
      <p className="font-light">{data?.deskripsiFormasi}</p>
      <Accordion
        variant="separated"
        defaultValue="Posisi #1"
        radius={"md"}
        className="chevron"
        chevron={<IconTriangleInvertedFilled className={"icon"} />}
      >
        <p className="mb-4 font-bold capitalize">daftar posisi</p>
        {items}
      </Accordion>
      <Modal
        title="Hapus Ensiklopedi?"
        opened={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
        }}
        centered
      >
        <DeleteEnsiklopediForm
          onSuccess={() => {
            setIsDeleteModalOpen(false);
            router.replace("/dashboard/admin/ensiklopedi-posisi-pemain");
          }}
          ensiklopediId={id}
        />
      </Modal>
    </div>
  );
}
