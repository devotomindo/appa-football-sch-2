"use client";

import {
  FormasiAsliImageInput,
  PosisiBertahanImageInput,
  PosisiMenyerangImageInput,
  TransisiBertahanImageInput,
  TransisiMenyerangImageInput,
} from "@/components/image-input/image-input";
import {
  KarakterInput,
  PosisiBertahanInput,
  PosisiMenyerangInput,
} from "@/components/text-input/text-input-with-add-btn";
import { GetAllPositionsQueryOptions } from "@/features-data/positions/actions/get-all-positions/query-options";
import {
  Accordion,
  Alert,
  Button,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconInfoCircle } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { createEnskilopediPemain } from "../../actions/create-ensiklopedi-pemain";

interface PosisiData {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const daftarPosisi = [
  {
    value: "Posisi #1",
  },
  {
    value: "Posisi #2",
  },
  {
    value: "Posisi #3",
  },
  {
    value: "Posisi #4",
  },
  {
    value: "Posisi #5",
  },
  {
    value: "Posisi #6",
  },
  {
    value: "Posisi #7",
  },
  {
    value: "Posisi #8",
  },
  {
    value: "Posisi #9",
  },
  {
    value: "Posisi #10",
  },
  {
    value: "Posisi #11",
  },
];

export function EnsiklopediPosisiPemainForm() {
  const { data: posisiData } = useQuery(GetAllPositionsQueryOptions());
  const router = useRouter();

  const [actionState, actionDispatch, isActionPending] = useActionState(
    createEnskilopediPemain,
    null,
  );

  useEffect(() => {
    if (actionState?.success) {
      notifications.show({
        title: "Success",
        message: actionState.message,
        color: "green",
        icon: <IconCheck />,
        autoClose: 3000,
      });
      router.replace("/dashboard/admin/ensiklopedi-posisi-pemain");
    }
  }, [actionState?.message, actionState?.success, router]);

  const items = daftarPosisi.map((item, index) => (
    <Accordion.Item key={item.value} value={item.value}>
      <Accordion.Control>{item.value}</Accordion.Control>
      <Accordion.Panel>
        <Select
          label="Pilih Posisi"
          placeholder="Pick value"
          data={posisiData
            ?.sort((a: PosisiData, b: PosisiData) =>
              a.name.localeCompare(b.name),
            )
            .map((value) => value.name)}
          searchable
          name="posisi"
          error={actionState?.error?.posisi}
        />
      </Accordion.Panel>
      <Accordion.Panel>
        <KarakterInput posisi={index} error={actionState?.error?.karakter} />
      </Accordion.Panel>
      <Accordion.Panel>
        <PosisiMenyerangInput posisi={index} />
        <PosisiMenyerangImageInput posisi={index} />
      </Accordion.Panel>
      <Accordion.Panel>
        <PosisiBertahanInput posisi={index} />
        <PosisiBertahanImageInput posisi={index} />
      </Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <form
      className="space-y-8"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(() => actionDispatch(new FormData(e.currentTarget)));
      }}
    >
      {actionState?.error?.general ? (
        <Alert variant="light" color="red" icon={<IconInfoCircle />} mb="1rem">
          {actionState.error.general}
        </Alert>
      ) : null}
      <TextInput
        label="Nama Formasi"
        placeholder="Masukkan nama formasi contoh: 4-4-2, 4-3-3, dan lain-lain"
        required
        withAsterisk={false}
        name="nama"
        className="shadow-lg"
        radius={"md"}
        error={actionState?.error?.nama}
      />

      <Textarea
        label="Deskripsi Formasi"
        placeholder="Masukkan deskripsi formasi"
        required
        withAsterisk={false}
        name="deskripsi"
        className="shadow-lg"
        radius={"md"}
        error={actionState?.error?.deskripsi}
      />

      <Accordion variant="separated" defaultValue="Posisi #1" radius={"md"}>
        {items}
      </Accordion>

      <div className="space-y-8">
        <p className="text-sm font-bold capitalize">
          upload gambar ilustrasi (Wajib Portrait)
        </p>
        <div className="flex gap-8">
          <div className="w-[300px]">
            <div className="text-sm font-bold capitalize">formasi asli</div>
            <FormasiAsliImageInput />
          </div>
          <div className="w-[300px]">
            <div className="text-sm font-bold capitalize">
              transisi menyerang
            </div>
            <TransisiMenyerangImageInput />
          </div>
          <div className="w-[300px]">
            <div className="text-sm font-bold capitalize">
              transisi bertahan
            </div>
            <TransisiBertahanImageInput />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="ml-auto !bg-green-500 hover:!bg-green-600"
        loading={isActionPending}
      >
        Simpan
      </Button>
    </form>
  );
}
