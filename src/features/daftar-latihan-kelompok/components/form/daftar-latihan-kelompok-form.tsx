"use client";

import {
  ActionIcon,
  Button,
  FileInput,
  NumberInput,
  Textarea,
  TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconMinus,
  IconPlus,
  IconUpload,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useState } from "react";
import { CreateLatihanKelompok } from "../../actions/create-latihan-kelompok";

export function DaftarLatihanKelompokForm() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [alat, setAlat] = useState<string[]>([""]);
  const [langkah, setLangkah] = useState<string[]>([""]);
  const router = useRouter();

  const handleVideoChange = (file: File | null) => {
    setVideoFile(file);
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setVideoPreview(videoUrl);

      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d")?.drawImage(video, 0, 0);
      };
      video.src = videoUrl;
    } else {
      setVideoPreview(null);
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
    CreateLatihanKelompok,
    undefined,
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
      router.replace("/dashboard/admin/daftar-latihan-kelompok");
    }
  }, [actionState?.message, actionState?.success, router]);

  return (
    <form
      className="w-full space-y-8"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(() => actionsDispatch(new FormData(e.currentTarget)));
      }}
    >
      {actionState?.error && (
        <p className="text-red-500">{actionState.message}</p>
      )}
      <TextInput
        label="Nama Metode Latihan"
        placeholder="Masukkan nama metode latihan"
        required
        withAsterisk={false}
        name="nama"
        className="shadow-lg"
        radius={"md"}
        error={actionState?.error?.nama}
      />

      <Textarea
        label="Deskripsi"
        placeholder="Masukkan deskripsi metode latihan"
        required
        withAsterisk={false}
        name="deskripsi"
        className="shadow-lg"
        radius={"md"}
        minRows={2}
        autosize
        error={actionState?.error?.deskripsi}
      />

      <NumberInput
        label="Jumlah Peserta"
        placeholder="Masukkan jumlah peserta"
        required
        min={2}
        withAsterisk={false}
        name="jumlah"
        className="shadow-lg"
        radius={"md"}
        error={actionState?.error?.jumlah}
      />

      <TextInput
        label="Luas Lapangan"
        placeholder="Masukkan luas lapangan"
        required
        withAsterisk={false}
        name="luas"
        className="shadow-lg"
        radius={"md"}
        error={actionState?.error?.luas}
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
              error={actionState?.error?.alat?.[index]}
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
              error={actionState?.error?.langkah?.[index]}
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
              color: "#ffffff !important",
              "&::placeholder": {
                color: "#ffffff !important",
              },
            },
          }}
          error={actionState?.error?.video}
        />
        {videoPreview && (
          <div className="mt-4 space-y-4">
            <div>
              <p className="mb-1 text-sm">Video Preview:</p>
              <video
                src={videoPreview}
                controls
                className="max-w-[400px] rounded-md"
              />
            </div>
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
