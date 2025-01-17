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
import { Accordion, Button, Select, Textarea, TextInput } from "@mantine/core";
import { startTransition, useActionState } from "react";

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

export function TambahEnsiklopediPosisiPemainForm() {
  // const [gambar, setGambar] = useState<File | null>(null);

  const [state, action, isPending] = useActionState(Add, null);

  const items = daftarPosisi.map((item, index) => (
    <Accordion.Item key={item.value} value={item.value}>
      <Accordion.Control>{item.value}</Accordion.Control>
      <Accordion.Panel>
        <Select
          label="Pilih Posisi"
          placeholder="Pick value"
          data={[
            "Goalkeeper",
            "Striker",
            "Winger",
            "Back",
            "Midfielder",
            "Defender",
          ]}
        />
      </Accordion.Panel>
      <Accordion.Panel>
        <KarakterInput posisi={index} />
      </Accordion.Panel>
      <Accordion.Panel>
        <PosisiMenyerangInput posisi={index} />
        {/* <FileInput
          label="Upload Gambar"
          placeholder="Pilih gambar"
          accept="image/*"
          className="mt-4 shadow-lg"
          radius="md"
          value={gambar}
          onChange={setGambar}
        /> */}
        <PosisiMenyerangImageInput posisi={index} />
      </Accordion.Panel>
      <Accordion.Panel>
        <PosisiBertahanInput posisi={index} />
        {/* <FileInput
          label="Upload Gambar"
          placeholder="Pilih gambar"
          accept="image/*"
          className="mt-4 shadow-lg"
          radius="md"
          value={gambar}
          onChange={setGambar}
        /> */}
        <PosisiBertahanImageInput posisi={index} />
      </Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <form
      className="space-y-8"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(() => action(new FormData(e.currentTarget)));
      }}
    >
      <TextInput
        label="Nama Formasi"
        placeholder="Masukkan nama formasi"
        required
        withAsterisk={false}
        name="nama"
        className="shadow-lg"
        radius={"md"}
      />

      <Textarea
        label="Deskripsi Formasi"
        placeholder="Masukkan deskripsi formasi"
        required
        withAsterisk={false}
        name="deskripsi"
        className="shadow-lg"
        radius={"md"}
      />

      <Accordion variant="separated" defaultValue="Posisi #1">
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
        loading={isPending}
      >
        Simpan
      </Button>
    </form>
  );
}

async function Add(prevState: any, formData: FormData) {
  const data = {
    nama: formData.get("nama"),
    deskripsi: formData.get("deskripsi"),
    // posisiMenyerang: formData.getAll("posisiMenyerang"),
    // posisiBertahan: formData.getAll("posisiBertahan"),
    // karakter: [
    //   {
    //     nama: formData.getAll("karakter-0"),
    //   },
    //   {
    //     nama: formData.getAll("karakter-1"),
    //   },
    // ],
    karakter: [...daftarPosisi].map((_, index) => {
      return {
        karakter: formData.getAll(`karakter-${index}`),
      };
    }),
    posisiMenyerang: [...daftarPosisi].map((_, index) => {
      return {
        posisiMenyerang: formData.getAll(`posisiMenyerang-${index}`),
      };
    }),
    posisiBertahan: [...daftarPosisi].map((_, index) => {
      return {
        posisiBertahan: formData.getAll(`posisiBertahan-${index}`),
      };
    }),
    gambarPosisiMenyerang: [...daftarPosisi].map((_, index) => {
      return {
        gambarPosisiMenyerang: formData.getAll(
          `gambar-posisi-menyerang-${index}`,
        )[0],
      };
    }),
    gambarPosisiBertahan: [...daftarPosisi].map((_, index) => {
      return {
        gambarPosisiBertahan: formData.getAll(
          `gambar-posisi-bertahan-${index}`,
        )[0],
      };
    }),
    gambarFormasiAsli: formData.getAll("gambar-formasi-asli")[0],
    gambarTransisiMenyerang: formData.getAll("gambar-transisi-menyerang")[0],
    gambarTransisiBertahan: formData.getAll("gambar-transisi-bertahan")[0],
  };

  console.log(data);

  // const response = await fetch("/api/ensiklopedi-posisi-pemain", {
  //     method: "POST",
  //     headers: {
  //     "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(data),
  // });

  // if (!response.ok) {
  //     throw new Error("Failed to add data");
  // }

  // return response.json();
}
