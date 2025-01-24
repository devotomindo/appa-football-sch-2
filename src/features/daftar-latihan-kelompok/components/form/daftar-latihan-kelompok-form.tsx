"use client";

import { getAllAlatLatihanWithoutImageQueryOptions } from "@/features/daftar-alat-latihan/actions/get-all-alat-latihan/query-options";
import { useEffectEvent } from "@/lib/hooks/useEffectEvent";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import {
  ActionIcon,
  Alert,
  Button,
  FileInput,
  NumberInput,
  Select,
  Switch,
  Textarea,
  TextInput,
} from "@mantine/core";
import {
  IconInfoCircle,
  IconMinus,
  IconPlus,
  IconUpload,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { redirect, useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useState } from "react";
import { createLatihanKelompok } from "../../actions/create-latihan-kelompok";

export function DaftarLatihanKelompokForm() {
  // Fetch alat latihan
  const alatLatihan = useQuery(getAllAlatLatihanWithoutImageQueryOptions());

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [alat, setAlat] = useState<Array<{ id: string; quantity: number }>>([
    { id: "", quantity: 1 },
  ]);
  const [langkah, setLangkah] = useState<string[]>([""]);
  const [needsTools, setNeedsTools] = useState(true);
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
    setAlat([...alat, { id: "", quantity: 1 }]);
  };

  const handleAlatChange = (value: string | null, index: number) => {
    const newAlat = [...alat];
    newAlat[index] = { ...newAlat[index], id: value || "" };
    setAlat(newAlat);
  };

  const handleQuantityChange = (value: number, index: number) => {
    const newAlat = [...alat];
    newAlat[index] = { ...newAlat[index], quantity: value as number };
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
    createLatihanKelompok,
    undefined,
  );

  const actionEffectEvent = useEffectEvent((state: typeof actionState) => {
    if (state) {
      formStateNotificationHelper({
        state,
        successCallback: () => {
          redirect("/dashboard/admin/daftar-latihan-kelompok");
        },
      });
    }
  });

  useEffect(
    () => actionEffectEvent(actionState),
    [actionState, actionEffectEvent],
  );

  // Helper function to get available tools (excluding already selected ones)
  const getAvailableTools = (currentIndex: number) => {
    const selectedTools = alat
      .map((item, idx) => (idx !== currentIndex ? item.id : null))
      .filter((id): id is string => id !== null && id !== "");

    return (
      alatLatihan.data
        ?.filter((item) => !selectedTools.includes(item.id))
        .map((item) => ({
          value: item.id,
          label: item.name,
        })) || []
    );
  };

  return (
    <form
      className="w-full space-y-8"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        // Only include non-empty tool entries
        if (needsTools) {
          const validTools = alat.filter((tool) => tool.id !== "");
          formData.append("tools", JSON.stringify(validTools));
        } else {
          formData.append("no_tools_needed", "true");
        }

        startTransition(() => actionsDispatch(formData));
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
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Kebutuhan Alat</h3>
          {actionState?.error?.tools && (
            <Alert icon={<IconInfoCircle />} color="red">
              {actionState.error.tools[0]}
            </Alert>
          )}
          <Switch
            label="Membutuhkan Alat"
            checked={needsTools}
            onChange={(event) => setNeedsTools(event.currentTarget.checked)}
          />
        </div>

        {needsTools && (
          <>
            <div className="flex items-center gap-2">
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
                <Select
                  placeholder="Pilih alat latihan"
                  data={getAvailableTools(index)}
                  value={item.id}
                  onChange={(value) => handleAlatChange(value, index)}
                  className="flex-1 shadow-lg"
                  radius="md"
                  name={`tool_${index}`} // Change name to be more descriptive but won't be used
                />
                <NumberInput
                  placeholder="Jumlah"
                  value={item.quantity}
                  onChange={(value) =>
                    handleQuantityChange(
                      value ? parseInt(value.toString()) : 1,
                      index,
                    )
                  }
                  min={1}
                  className="w-24 shadow-lg"
                  radius="md"
                  name={`quantity_${index}`} // Change name to be more descriptive but won't be used
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
          </>
        )}
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
          <div key={index} className="flex items-center gap-2">
            <Textarea
              placeholder="Masukkan langkah-langkah latihan"
              value={item}
              onChange={(e) => handleLangkahChange(e.target.value, index)}
              minRows={2}
              className="flex-1 shadow-lg"
              radius="md"
              name={`langkah[${index}]`} // Changed this line
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
