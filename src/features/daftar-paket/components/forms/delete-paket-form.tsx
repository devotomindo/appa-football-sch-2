"use client";

import { useEffectEvent } from "@/lib/hooks/useEffectEvent";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import { Button } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useQueryClient } from "@tanstack/react-query";
import { startTransition, useActionState, useEffect } from "react";
import { deletePaket } from "../../actions/delete-paket";
import { getAllPackagesQueryOptions } from "../../actions/get-all-daftar-paket/query-options";

type DeletePaketFormProps = {
  paketId: string;
};

export function DeletePaketForm({ paketId }: DeletePaketFormProps) {
  const queryClient = useQueryClient();
  const [actionState, actionDispatch, isActionPending] = useActionState(
    deletePaket,
    undefined,
  );

  const actionEffectEvent = useEffectEvent((state: typeof actionState) => {
    if (state) {
      formStateNotificationHelper({
        state,
        successCallback: () => {
          modals.closeAll();
          queryClient.invalidateQueries(getAllPackagesQueryOptions());
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
          formData.set("id", paketId);
          actionDispatch(formData);
        });
      }}
    >
      <div className="space-y-4">
        <p>Apakah anda yakin ingin menghapus paket ini?</p>
        <div className="flex justify-end gap-2">
          <Button variant="default" onClick={() => modals.closeAll()}>
            Batal
          </Button>
          <Button type="submit" color="red" loading={isActionPending}>
            Hapus
          </Button>
        </div>
      </div>
    </form>
  );
}
