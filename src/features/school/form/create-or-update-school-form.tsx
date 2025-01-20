"use client";

import { SubmitButton } from "@/components/buttons/submit-button";
import { useEffectEvent } from "@/lib/hooks/useEffectEvent";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import { Button, FileInput, Modal, Select, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  FormEvent,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { createSchool } from "../action/create-school";
import { getIndonesianCitiesQueryOptions } from "../action/get-indonesian-cities/query-options";

export function CreateOrUpdateSchoolForm({ schoolData }: { schoolData?: any }) {
  const indonesianCities = useQuery(getIndonesianCitiesQueryOptions());

  const indonesianCitiesOptions = indonesianCities.data?.map((city) => ({
    value: city.id.toString(),
    label: city.name,
  }));

  // Controlled form states
  const [name, setName] = useState(schoolData?.name || "");
  const [address, setAddress] = useState(schoolData?.address || "");
  const [homebase, setHomebase] = useState(schoolData?.homebase || "");
  const [phone, setPhone] = useState(schoolData?.phone || "");
  const [city, setCity] = useState(schoolData?.city || "");
  const [fileValue, setFileValue] = useState<File | null>(null);

  const fileUrl = fileValue ? URL.createObjectURL(fileValue) : null;

  const [
    isConfirmationModalOpen,
    { open: openConfirmationModal, close: closeConfirmationModal },
  ] = useDisclosure();

  const [actionState, actionDispatch, isActionPending] = useActionState(
    createSchool,
    undefined,
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("address", address);
      formData.append("homebase", homebase);
      formData.append("phone", phone);
      formData.append("city", city);
      if (fileValue) {
        formData.append("logo", fileValue);
      }
      actionDispatch(formData);
    });
    closeConfirmationModal();
  };

  const actionEffectEvent = useEffectEvent((state: typeof actionState) => {
    if (state) {
      formStateNotificationHelper({
        state,
        successCallback: () => {
          redirect("/dashboard");
        },
      });
    }
  });

  useEffect(
    () => actionEffectEvent(actionState),
    [actionState, actionEffectEvent],
  );

  return (
    <div className="space-y-4 rounded-lg bg-white p-4 shadow-md">
      <h1 className="text-xl font-semibold">
        {schoolData ? "Update Informasi SSB" : "Daftarkan SSB Baru"}
      </h1>
      <div className="space-y-4">
        <TextInput
          label="Nama SSB"
          placeholder="Masukkan nama SSB"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={actionState?.error?.name}
        />
        <TextInput
          label="Alamat SSB"
          placeholder="Masukkan alamat SSB"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          error={actionState?.error?.address}
        />
        <TextInput
          label="Homebase SSB"
          placeholder="Masukkan homebase SSB (contoh: Lapangan Gelora Bung Karno)"
          required
          value={homebase}
          onChange={(e) => setHomebase(e.target.value)}
          error={actionState?.error?.homebase}
        />
        <TextInput
          label="Nomor Telepon"
          placeholder="Masukkan nomor telepon SSB"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={actionState?.error?.phone}
        />
        <Select
          label="Kota / Kabupaten SSB"
          placeholder="Pilih Kota / Kabupaten"
          required
          data={indonesianCitiesOptions}
          value={city}
          onChange={(value) => setCity(value || "")}
          searchable
          error={actionState?.error?.city}
        />
        <FileInput
          label="Logo SSB"
          accept="image/png, image/jpg, image/webp"
          onChange={setFileValue}
          error={actionState?.error?.logo}
        />
        {(fileValue || (schoolData && schoolData.logoUrl)) && (
          <Image
            src={fileUrl ?? schoolData?.logoUrl ?? ""}
            alt="Profile Picture"
            width={200}
            height={200}
          />
        )}

        <Button onClick={openConfirmationModal}>Simpan</Button>

        <Modal
          opened={isConfirmationModalOpen}
          onClose={closeConfirmationModal}
          centered
          title="Konfirmasi Pendaftaran SSB"
          size={"lg"}
        >
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <p>
                Dengan mendaftarkan SSB Anda setuju untuk mendaftarkan diri Anda
                sebagai Head Coach SSB tersebut. Apakah Anda yakin ingin
                melanjutkan?
              </p>
              <div className="flex justify-evenly">
                <Button color="red" onClick={closeConfirmationModal}>
                  Batal
                </Button>
                <SubmitButton color="green">Ya, Lanjutkan</SubmitButton>
              </div>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
