"use client";

import { DeleteProPlayer } from "@/features/data-asesmen/actions/delete-pro-player";
import { useEffectEvent } from "@/lib/hooks/useEffectEvent";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import { Button } from "@mantine/core";
import { FormEvent, startTransition, useActionState, useEffect } from "react";

export function DeletePemainProForm({
  onSuccess,
  proPlayerId,
}: {
  proPlayerId: string;
  onSuccess?: () => void;
}) {
  const [actionState, actionDispatch, isActionPending] = useActionState(
    DeleteProPlayer,
    undefined,
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      const formData = new FormData();
      formData.append("proPlayerId", proPlayerId);

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
