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
import { FormationImage } from "../../../../../components/container/formation-image";
import { DeleteEnsiklopediForm } from "../../form/delete-ensiklopedi-form";
import { daftarPosisi } from "../../form/ensiklopedi-posisi-pemain-form";

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
              <div className="flex justify-start rounded-xl border-2 p-4 shadow-lg">
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
    <div className="space-y-8 p-4 sm:space-y-10 md:space-y-14 md:p-6">
      <Link
        href={
          isAdmin
            ? "/dashboard/admin/ensiklopedi-posisi-pemain"
            : "/dashboard/ensiklopedi-posisi-pemain"
        }
      >
        <Button
          className="flex w-full flex-row items-center justify-center bg-indigo-500 capitalize hover:bg-indigo-600 focus-visible:outline-2 sm:w-32"
          leftSection={<IconArrowLeft size={18} />}
        >
          back
        </Button>
      </Link>
      <div className="flex flex-col gap-4 sm:flex-row md:items-center md:justify-between">
        <h1 className="flex-1 text-xl font-bold uppercase sm:text-2xl">
          formasi {data?.namaFormasi.split("").join("-")}
        </h1>
        {isAdmin && (
          <div className="flex w-full flex-1 flex-col gap-2 sm:flex-row sm:space-x-4 md:justify-end">
            <Link
              className="w-full sm:w-32"
              href={`/dashboard/admin/ensiklopedi-posisi-pemain/detail-ensiklopedi-posisi-pemain/${id}/edit`}
            >
              <Button
                className="flex w-full flex-row items-center justify-center bg-indigo-500 capitalize hover:bg-indigo-600 focus-visible:outline-2 sm:w-32"
                rightSection={<IconEdit size={18} />}
              >
                Edit
              </Button>
            </Link>
            <Button
              className="flex w-full flex-row items-center justify-center !bg-red-500 capitalize hover:!bg-red-600 focus-visible:outline-2 sm:w-32"
              rightSection={<IconTrash size={18} />}
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Hapus
            </Button>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-6 md:flex-row md:justify-between">
        <FormationImage
          title="formasi asli"
          imageSrc={data?.gambarFormasiDefault}
          altText="formasi-default"
        />
        <FormationImage
          title="transisi menyerang"
          imageSrc={data?.gambarOffense}
          altText="formasi-offense"
        />
        <FormationImage
          title="transisi bertahan"
          imageSrc={data?.gambarDefense}
          altText="formasi-defense"
        />
      </div>
      <p className="font-light">{data?.deskripsiFormasi}</p>
      <Accordion
        variant="separated"
        multiple
        defaultValue={daftarPosisi.map((item) => item.value)}
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
