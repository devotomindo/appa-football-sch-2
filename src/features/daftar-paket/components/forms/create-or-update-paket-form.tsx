"use client";

import { useEffectEvent } from "@/lib/hooks/useEffectEvent";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import { Button, NumberInput, Textarea, TextInput } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { startTransition, useActionState, useEffect } from "react";
import { createPaket } from "../../actions/create-paket";
import { GetAllPackagesResponse } from "../../actions/get-all-daftar-paket";
import { getAllPackagesQueryOptions } from "../../actions/get-all-daftar-paket/query-options";
import { updatePaket } from "../../actions/update-paket";

type CreatePaketFormProps = {
  paketData?: GetAllPackagesResponse[number];
  onSuccess?: () => void;
};

export function CreateOrUpdatePaketForm({
  paketData,
  onSuccess,
}: CreatePaketFormProps) {
  const queryClient = useQueryClient();

  // CREATE OR UPDATE PAKET
  const [actionState, actionDispatch, isActionPending] = useActionState(
    paketData ? updatePaket : createPaket,
    undefined,
  );

  const actionEffectEvent = useEffectEvent((state) => {
    if (state) {
      formStateNotificationHelper({
        state,
        successCallback: () => {
          queryClient.invalidateQueries(getAllPackagesQueryOptions());
          if (onSuccess) onSuccess();
        },
      });
    }
  });

  useEffect(
    () => actionEffectEvent(actionState),
    [actionState, actionEffectEvent],
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(() => {
          const formData = new FormData(e.currentTarget);

          // Parse the formatted price string back to number
          const priceString = formData.get("price") as string;
          const priceNumber = Number(priceString.replace(/\s/g, ""));
          formData.set("price", priceNumber.toString());

          if (paketData) {
            formData.append("id", paketData.id);
          }

          actionDispatch(formData);
        });
      }}
      className="grid gap-4"
    >
      <TextInput
        name="name"
        label="Nama Paket"
        required
        defaultValue={paketData?.name}
        error={actionState?.error?.name}
      />

      <Textarea
        name="description"
        label="Deskripsi"
        defaultValue={paketData?.description}
        required
        error={actionState?.error?.description}
      />

      <NumberInput
        name="price"
        label="Harga"
        leftSection={<span className="text-xs">Rp</span>}
        thousandSeparator=" "
        required
        defaultValue={paketData?.price}
        min={0}
        error={actionState?.error?.price}
        hideControls
      />

      <NumberInput
        name="monthDuration"
        label="Durasi (Bulan)"
        required
        defaultValue={paketData?.monthDuration}
        min={1}
        error={actionState?.error?.monthDuration}
      />

      <NumberInput
        name="quotaAddition"
        label="Tambahan Kuota"
        required
        defaultValue={paketData?.quotaAddition}
        min={1}
        error={actionState?.error?.quotaAddition}
      />

      <div className="mt-8 flex justify-end">
        <Button type="submit" loading={isActionPending}>
          {paketData ? "Update" : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
