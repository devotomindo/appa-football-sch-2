"use client";
import { SubmitButton } from "@/components/buttons/submit-button";
import { getCitiesByProvinceIdQueryOptions } from "@/features/school/action/get-cities-by-province-id/query-options";
import { getIndonesianProvincesQueryOptions } from "@/features/school/action/get-indonesian-provinces/query-options";
import { useEffectEvent } from "@/lib/hooks/useEffectEvent";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import {
  FileInput,
  Group,
  NumberInput,
  Radio,
  Select,
  TextInput,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/id";
import Image from "next/image";
import {
  startTransition,
  useActionState,
  useEffect,
  useMemo,
  useState,
} from "react";
import { GetUserByIdResponse } from "../../actions/get-user-by-id";
import { getUserByIdQueryOptions } from "../../actions/get-user-by-id/query-options";
import { updateProfile } from "../../actions/update-profile";

dayjs.locale("id");

export function UserProfileUpdateForm({
  userData,
  onClose,
  successCallback,
}: {
  userData: GetUserByIdResponse & { avatarUrl?: string };
  onClose?: () => void;
  successCallback?: () => void;
}) {
  const [fileValue, setFileValue] = useState<File | null>(null);
  const fileUrl = fileValue ? URL.createObjectURL(fileValue) : null;

  const [actionState, actionDispatch, isActionPending] = useActionState(
    updateProfile,
    undefined,
  );

  const queryClient = useQueryClient();

  const actionEffectEvent = useEffectEvent((state: typeof actionState) => {
    if (state) {
      formStateNotificationHelper({
        state,
        successCallback: () => {
          if (onClose) {
            onClose();
          }

          // kalau update user, invalidate user yang bersangkutan
          if (userData) {
            queryClient.invalidateQueries(getUserByIdQueryOptions(userData.id));
          }

          if (successCallback) {
            successCallback();
          }
        },
      });
    }
  });

  useEffect(
    () => actionEffectEvent(actionState),
    [actionState, actionEffectEvent],
  );

  // Start of Domisili

  const [domisiliProvinsi, setDomisiliProvinsi] = useState(
    userData.domisiliProvinsi,
  );
  const [domisiliKota, setDomisiliKota] = useState(userData.domisiliKota);

  const indonesianProvinces = useQuery(getIndonesianProvincesQueryOptions());

  const provinceOptions = useMemo(() => {
    if (!indonesianProvinces.data) return [];

    return indonesianProvinces.data.map((province) => ({
      value: province.id.toString(),
      label: province.name,
    }));
  }, [indonesianProvinces.data]);

  const citiesByProvince = useQuery(
    getCitiesByProvinceIdQueryOptions(domisiliProvinsi),
  );

  const cityOptions = useMemo(() => {
    if (!citiesByProvince.data) return [];

    return citiesByProvince.data.map((city) => ({
      value: city.id.toString(),
      label: city.name,
    }));
  }, [citiesByProvince.data]);

  // End of Domisili

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        startTransition(() => {
          const formData = new FormData(e.currentTarget);
          formData.append("id", userData.id);

          actionDispatch(formData);
        });
      }}
    >
      <div className="space-y-4">
        <FileInput
          name="profilePic"
          label="Foto Profil"
          accept="image/png, image/jpg, image/webp"
          onChange={setFileValue}
          error={actionState?.error?.profilePic}
        />
        {(userData.avatarUrl || fileValue) && (
          <Image
            src={fileUrl ?? userData.avatarUrl ?? ""}
            alt="Profile Picture"
            width={200}
            height={200}
          />
        )}
        <TextInput
          defaultValue={userData.name ?? undefined}
          name="name"
          label="Nama Lengkap"
          required
          error={actionState?.error?.name}
        />
        <DateInput
          defaultValue={
            userData.birthDate ? new Date(userData.birthDate) : undefined
          }
          name="birthDate"
          label="Tanggal Lahir"
          required
          error={actionState?.error?.birthDate}
          locale="id"
          valueFormat="DD MMMM YYYY"
        />
        <Radio.Group
          defaultValue={
            userData.isMale === null || userData.isMale === undefined
              ? null
              : userData.isMale
                ? "true"
                : "false"
          }
          name="isMale"
          label="Jenis Kelamin"
          error={actionState?.error?.isMale}
          required
        >
          <Group mt="xs">
            <Radio value="true" label="Laki-laki" />
            <Radio value="false" label="Perempuan" />
          </Group>
        </Radio.Group>
        <NumberInput
          defaultValue={userData.bodyHeight}
          name="bodyHeight"
          label="Tinggi Badan (cm)"
          required
          min={100}
          max={250}
          error={actionState?.error?.bodyHeight}
        />
        <NumberInput
          defaultValue={userData.bodyWeight}
          name="bodyWeight"
          label="Berat Badan (kg)"
          required
          min={30}
          max={200}
          error={actionState?.error?.bodyWeight}
        />
        <Select
          label="Provinsi Domisili"
          name="domisiliProvinsi"
          error={actionState?.error?.domisiliProvinsi}
          value={domisiliProvinsi ? domisiliProvinsi.toString() : null}
          data={provinceOptions}
          onChange={(value) => {
            if (value) {
              setDomisiliProvinsi(parseInt(value));
              setDomisiliKota(null);
            }
          }}
          searchable
          required
        />
        <Select
          label="Kota/Kabupaten Domisili"
          name="domisiliKota"
          error={actionState?.error?.domisiliKota}
          value={domisiliKota ? domisiliKota.toString() : null}
          data={cityOptions}
          onChange={(value) => {
            if (value) {
              setDomisiliKota(parseInt(value));
            }
          }}
          searchable
          required
        />

        <SubmitButton fullWidth loading={isActionPending}>
          Simpan
        </SubmitButton>
      </div>
    </form>
  );
}
