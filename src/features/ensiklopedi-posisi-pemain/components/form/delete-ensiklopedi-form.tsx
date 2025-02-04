"use client";

import { useEffectEvent } from "@/lib/hooks/useEffectEvent";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import { Button } from "@mantine/core";
import { FormEvent, startTransition, useActionState, useEffect } from "react";
import { DeleteEnsiklopediPemain } from "../../actions/delete-ensiklopedi-pemain";

export function DeleteEnsiklopediForm({
  onSuccess,
  ensiklopediId,
}: {
  onSuccess: () => void;
  ensiklopediId: string;
}) {
  const [actionState, actionDispatch, isActionPending] = useActionState(
    DeleteEnsiklopediPemain,
    undefined,
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      const formData = new FormData();
      formData.append("ensiklopediId", ensiklopediId);

      actionDispatch(formData);
    });
  };

  const actionEffectEvent = useEffectEvent((state: typeof actionState) => {
    if (state) {
      formStateNotificationHelper({
        state,
        successCallback: () => {
          onSuccess?.();
        },
      });
    }
  });

  useEffect(
    () => actionEffectEvent(actionState),
    [actionState, actionEffectEvent],
  );

  return (
    <form onSubmit={handleSubmit}>
      <Button
        type="submit"
        className="ml-auto !bg-red-500 hover:!bg-red-600"
        disabled={isActionPending}
        loading={isActionPending}
      >
        Hapus
      </Button>
    </form>
  );
}
