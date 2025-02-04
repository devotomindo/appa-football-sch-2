"use client";

import { SubmitButton } from "@/components/buttons/submit-button";
import { completeAssessmentSession } from "@/features/data-asesmen/actions/complete-assessment-session";
import { useEffectEvent } from "@/lib/hooks/useEffectEvent";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import { startTransition, useActionState, useEffect } from "react";

export function CompleteSessionForm({
  sessionId,
  onSuccess,
}: {
  sessionId: string;
  onSuccess?: () => void;
}) {
  const [actionState, actionsDispatch, isActionPending] = useActionState(
    completeAssessmentSession,
    undefined,
  );

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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.append("sessionId", sessionId);

        startTransition(() => actionsDispatch(formData));
      }}
    >
      <p>
        Apakah Anda yakin ingin menyelesaikan sesi penilaian ini? Setelah
        diselesaikan, nilai tidak dapat diubah lagi
      </p>
      <SubmitButton
        color="green"
        mt={10}
        loading={isActionPending}
        disabled={isActionPending}
      >
        Selesaikan
      </SubmitButton>
    </form>
  );
}
