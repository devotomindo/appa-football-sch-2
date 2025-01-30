"use client";

import { GetAllPositionsQueryOptions } from "@/features-data/positions/actions/get-all-positions/query-options";
import { createPemainPro } from "@/features/data-asesmen/actions/create-pemain-pro";
import { editPemainPro } from "@/features/data-asesmen/actions/edit-pemain-pro";
import { GetAllCountriesQueryOptions } from "@/features/data-asesmen/actions/get-all-countries/query-options";
import { getProPlayerByIdQueryOptions } from "@/features/data-asesmen/actions/get-pro-player-by-id/query-options";
import { useEffectEvent } from "@/lib/hooks/useEffectEvent";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import {
  Button,
  FileInput,
  NumberInput,
  Select,
  TextInput,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FormEvent,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";

export function TambahPemainProForm({
  id,
  state,
}: {
  id?: string;
  state: "create" | "edit";
}) {
  const [actionState, actionDispatch, actionIsPending] = useActionState(
    state === "create" ? createPemainPro : editPemainPro,
    undefined,
  );
  // const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { data: allPositionsData } = useQuery(GetAllPositionsQueryOptions());
  const { data: allCountriesData } = useQuery(GetAllCountriesQueryOptions());
  const router = useRouter();
  const { data: pemainProData } = useQuery({
    ...getProPlayerByIdQueryOptions(id ?? ""),
    enabled: Boolean(id),
  });
  const [fileValue, setFileValue] = useState<File | null>(null);
  const fileUrl = fileValue ? URL.createObjectURL(fileValue) : null;

  // const handleImageChange = (file: File | null) => {
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setImagePreview(reader.result as string);
  //     };
  //     reader.readAsDataURL(file);
  //   } else {
  //     setImagePreview(null);
  //   }
  // };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      if (id) {
        formData.append("id", id);
      }
      if (fileValue) {
        formData.append("foto", fileValue);
      }
      actionDispatch(formData);
    });
  };

  const actionEffectEvent = useEffectEvent((state: typeof actionState) => {
    if (state) {
      formStateNotificationHelper({
        state,
        successCallback: () => {
          router.replace("/dashboard/admin/data-asesmen");
        },
      });
    }
  });

  useEffect(
    () => actionEffectEvent(actionState),
    [actionState, actionEffectEvent],
  );

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      {actionState?.error?.general && (
        <div className="text-red-500">{actionState.error.general}</div>
      )}
      {/* <div className="space-y-4">
        {imagePreview && (
          <div className="relative h-72 w-72 rounded-xl">
            <Image
              src={imagePreview}
              alt="Preview"
              className="h-full w-full rounded-xl object-contain"
              width={500}
              height={500}
            />
          </div>
        )}
        <FileInput
          label="Foto Pemain"
          accept="image/*"
          name="foto"
          onChange={handleImageChange}
          className="shadow-lg"
          radius="md"
          required
          withAsterisk={false}
          error={actionState?.error?.foto}
        />
      </div> */}
      <div className="space-y-4">
        <FileInput
          label="Gambar Pemain Pro"
          onChange={setFileValue}
          accept="image/*"
        />
        {(pemainProData?.photoUrl || fileValue) && pemainProData?.photoPath && (
          <Image
            src={fileUrl ?? pemainProData?.photoUrl ?? ""}
            alt="Profile Picture"
            width={200}
            height={200}
          />
        )}
      </div>

      <TextInput
        label="Nama Pemain"
        required
        withAsterisk={false}
        name="nama"
        className="shadow-lg"
        radius={"md"}
        error={actionState?.error?.nama}
        defaultValue={pemainProData?.playersName ?? undefined}
      />

      <div className="flex items-center gap-4">
        <NumberInput
          label="Umur"
          required
          withAsterisk={false}
          name="umur"
          className="shadow-lg"
          radius={"md"}
          error={actionState?.error?.umur}
          defaultValue={pemainProData?.age ?? undefined}
        />

        <NumberInput
          label="Berat Badan"
          required
          withAsterisk={false}
          name="berat"
          className="shadow-lg"
          radius={"md"}
          error={actionState?.error?.berat}
          defaultValue={pemainProData?.weight ?? undefined}
        />

        <NumberInput
          label="Tinggi Badan"
          required
          withAsterisk={false}
          name="tinggi"
          className="shadow-lg"
          radius={"md"}
          error={actionState?.error?.tinggi}
          defaultValue={pemainProData?.height ?? undefined}
        />
      </div>

      <TextInput
        label="Tim"
        required
        withAsterisk={false}
        name="tim"
        className="shadow-lg"
        radius={"md"}
        error={actionState?.error?.tim}
        defaultValue={pemainProData?.currentTeam ?? undefined}
      />

      <Select
        label="Posisi"
        data={
          allPositionsData
            ?.map((position) => ({
              value: position.id,
              label: position.name,
            }))
            .sort((a, b) => a.label.localeCompare(b.label)) || []
        }
        searchable
        name="positionId"
        required
        withAsterisk={false}
        error={actionState?.error?.positionId}
        defaultValue={pemainProData?.positionId ?? undefined}
      />

      <Select
        label="Negara"
        data={
          allCountriesData
            ?.map((country) => ({
              value: country.id.toString(),
              label: country.name,
            }))
            .sort((a, b) => a.label.localeCompare(b.label)) || []
        }
        searchable
        name="countryId"
        required
        withAsterisk={false}
        error={actionState?.error?.countryId}
        defaultValue={pemainProData?.countryId?.toString() ?? undefined}
      />

      <Button
        type="submit"
        className="ml-auto !bg-green-500 hover:!bg-green-600"
        disabled={actionIsPending}
        loading={actionIsPending}
      >
        {state === "edit" ? "Edit" : "Simpan"}
      </Button>
    </form>
  );
}
