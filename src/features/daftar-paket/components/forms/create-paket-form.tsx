"use client";

import { useEffectEvent } from "@/lib/hooks/useEffectEvent";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import { Button, NumberInput, Textarea, TextInput } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { startTransition, useActionState, useEffect } from "react";
import { createPaket } from "../../actions/create-paket";
import { getAllPackagesQueryOptions } from "../../actions/get-all-daftar-paket/query-options";

type CreatePaketFormProps = {
  onSuccess?: () => void;
};

export function CreatePaketForm({ onSuccess }: CreatePaketFormProps) {
  const queryClient = useQueryClient();

  // CREATE PAKET
  const [actionState, actionDispatch, isActionPending] = useActionState(
    createPaket,
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
  // END OF CREATE PAKET

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(() => {
          const formData = new FormData(e.currentTarget);
          actionDispatch(formData);
        });
      }}
      className="grid gap-4"
    >
      <TextInput
        name="name"
        label="Nama Paket"
        required
        error={actionState?.error?.name}
      />

      <Textarea
        name="description"
        label="Deskripsi"
        required
        error={actionState?.error?.description}
      />

      <NumberInput
        name="price"
        label="Harga"
        required
        min={0}
        error={actionState?.error?.price}
      />

      <NumberInput
        name="monthDuration"
        label="Durasi (Bulan)"
        required
        min={1}
        error={actionState?.error?.monthDuration}
      />

      <NumberInput
        name="quotaAddition"
        label="Tambahan Kuota"
        required
        min={1}
        error={actionState?.error?.quotaAddition}
      />

      <div className="mt-8 flex justify-end">
        <Button type="submit" loading={isActionPending}>
          Simpan
        </Button>
      </div>
    </form>
  );
}
