"use client";

import { SubmitButton } from "@/components/buttons/submit-button";
import { useEffectEvent } from "@/lib/hooks/useEffectEvent";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import { FormEvent, startTransition, useActionState, useEffect } from "react";
import { deleteTool } from "../../actions/delete-alat-latihan";
import { GetAllAlatLatihanResponse } from "../../actions/get-all-alat-latihan";

export function DeleteAlatLatihanForm({
  toolData,
  onSuccess,
}: {
  toolData?: GetAllAlatLatihanResponse[number];
  onSuccess?: () => void;
}) {
  const [actionState, actionDispatch, isActionPending] = useActionState(
    deleteTool,
    undefined,
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      if (toolData) {
        formData.append("id", toolData.id);
      }

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
      <SubmitButton
        color="red"
        loading={isActionPending}
        disabled={isActionPending}
      >
        Hapus
      </SubmitButton>
    </form>
  );
}
