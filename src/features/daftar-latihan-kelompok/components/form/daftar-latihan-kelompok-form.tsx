"use client";

import {
  ActionIcon,
  Button,
  FileInput,
  NumberInput,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconMinus, IconPlus, IconUpload } from "@tabler/icons-react";
import Image from "next/image";
import { startTransition, useActionState, useState } from "react";
import { z } from "zod";
import { zfd } from "zod-form-data";

export default function DaftarLatihanKelompokForm() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [alat, setAlat] = useState<string[]>([""]);
  const [langkah, setLangkah] = useState<string[]>([""]);

  const handleVideoChange = (file: File | null) => {
    setVideoFile(file);
    if (file) {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d")?.drawImage(video, 0, 0);
        setThumbnail(canvas.toDataURL());
      };
      video.src = URL.createObjectURL(file);
    } else {
      setThumbnail(null);
    }
  };

  const handleAddAlat = () => {
    setAlat([...alat, ""]);
  };

  const handleAlatChange = (value: string, index: number) => {
    const newAlat = [...alat];
    newAlat[index] = value;
    setAlat(newAlat);
  };

  const handleRemoveAlat = (index: number) => {
    if (alat.length > 1) {
      const newAlat = alat.filter((_, i) => i !== index);
      setAlat(newAlat);
    }
  };

  const handleAddLangkah = () => {
    setLangkah([...langkah, ""]);
  };

  const handleLangkahChange = (value: string, index: number) => {
    const newLangkah = [...langkah];
    newLangkah[index] = value;
    setLangkah(newLangkah);
  };

  const handleRemoveLangkah = (index: number) => {
    if (langkah.length > 1) {
      const newLangkah = langkah.filter((_, i) => i !== index);
      setLangkah(newLangkah);
    }
  };

  const [actionState, actionsDispatch, isActionPending] = useActionState(
    Add,
    undefined,
  );

  return (
    <form
      className="w-full space-y-8"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(() => actionsDispatch(new FormData(e.currentTarget)));
      }}
    >
      <TextInput
        label="Nama Metode Latihan"
        placeholder="Masukkan nama metode latihan"
        required
        withAsterisk={false}
        name="nama"
        className="shadow-lg"
        radius={"md"}
      />

      <Textarea
        label="Deskripsi"
        placeholder="Masukkan deskripsi metode latihan"
        required
        withAsterisk={false}
        name="deskripsi"
        className="shadow-lg"
        radius={"md"}
      />

      <NumberInput
        label="Jumlah Peserta"
        placeholder="Masukkan jumlah peserta"
        required
        min={1}
        withAsterisk={false}
        name="jumlah"
        className="shadow-lg"
        radius={"md"}
      />

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Kebutuhan Alat</h3>
          <ActionIcon
            variant="filled"
            color="blue"
            onClick={handleAddAlat}
            size="sm"
          >
            <IconPlus size={16} />
          </ActionIcon>
        </div>
        {alat.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <TextInput
              placeholder="Masukkan kebutuhan alat"
              value={item}
              onChange={(e) => handleAlatChange(e.target.value, index)}
              className="flex-1 shadow-lg"
              radius="md"
              name="alat"
            />
            {alat.length > 1 && (
              <ActionIcon
                variant="filled"
                color="red"
                onClick={() => handleRemoveAlat(index)}
                size="sm"
              >
                <IconMinus size={16} />
              </ActionIcon>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">Langkah Latihan</h3>
          <ActionIcon
            variant="filled"
            color="blue"
            onClick={handleAddLangkah}
            size="sm"
          >
            <IconPlus size={16} />
          </ActionIcon>
        </div>
        {langkah.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <Textarea
              placeholder="Masukkan langkah-langkah latihan"
              value={item}
              onChange={(e) => handleLangkahChange(e.target.value, index)}
              minRows={2}
              className="flex-1 shadow-lg"
              radius="md"
              name="langkah"
            />
            {langkah.length > 1 && (
              <ActionIcon
                variant="filled"
                color="red"
                onClick={() => handleRemoveLangkah(index)}
                size="sm"
              >
                <IconMinus size={16} />
              </ActionIcon>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <FileInput
          label="Upload Video"
          placeholder="Pilih file video"
          accept="video/*"
          leftSection={<IconUpload size={16} />}
          name="video"
          className="w-fit shadow-lg"
          radius={"md"}
          value={videoFile}
          onChange={handleVideoChange}
          styles={{
            input: {
              backgroundColor: "#E58525",
              color: "white",
              "&::placeholder": {
                color: "rgba(255, 255, 255, 0.8)",
              },
            },
          }}
        />
        {thumbnail && (
          <div className="mt-2">
            <p className="mb-1 text-sm">Preview:</p>
            <Image
              src={thumbnail}
              alt="Video thumbnail"
              className="max-w-[200px] rounded-md"
              width={200}
              height={200}
            />
          </div>
        )}
      </div>

      <div className="flex w-full">
        <Button
          type="submit"
          className="ml-auto !bg-green-500 hover:!bg-green-600"
          loading={isActionPending}
        >
          Simpan
        </Button>
      </div>
    </form>
  );
}

async function Add(prevState: any, formData: FormData) {
  const validationResult = await zfd
    .formData({
      video: zfd.file(z.instanceof(File)),
      nama: zfd.text(
        z.string().min(3, "Nama metode latihan minimal 3 karakter"),
      ),
      deskripsi: zfd.text(z.string().min(3, "Deskripsi minimal 3 karakter")),
      jumlah: zfd.numeric(z.number().min(1, "Jumlah peserta minimal 1")),
      alat: zfd.repeatable(
        z.array(z.string().min(1, "Kebutuhan alat tidak boleh kosong")),
      ),
      langkah: zfd.repeatable(
        z.array(z.string().min(1, "Langkah latihan tidak boleh kosong")),
      ),
    })
    .safeParseAsync(formData);

  // validasi error
  if (!validationResult.success) {
    const errorFormatted = validationResult.error.format() as any;
    return {
      error: {
        video: errorFormatted.video?._errors,
        nama: errorFormatted.nama?._errors,
        deskripsi: errorFormatted.deskripsi?._errors,
        jumlah: errorFormatted.jumlah?._errors,
        alat: errorFormatted.alat?._errors,
        langkah: errorFormatted.langkah?._errors,
      },
    };
  }

  // if success
  return {
    success: true,
    message: "Data berhasil disimpan!",
  };
}
