"use client";

import { useEffectEvent } from "@/lib/hooks/useEffectEvent";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import { Button } from "@mantine/core";
import { FormEvent, startTransition, useActionState, useEffect } from "react";
import { deletePenugasanLatihanIndividuById } from "../actions/delete-penugasan-latihan-individu-by-id";

export function DeletePenugasanLatihanIndividuForm({
  assignmentId,
  studentId,
  onSuccess,
}: {
  assignmentId: string;
  studentId: string;
  onSuccess: () => void;
}) {
  const [actionState, actionDispatch, isActionPending] = useActionState(
    deletePenugasanLatihanIndividuById,
    undefined,
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      const formData = new FormData();
      formData.append("assignmentId", assignmentId);
      formData.append("studentId", studentId);

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
        Hapus penugasan pemain ini
      </Button>
    </form>
  );
}
