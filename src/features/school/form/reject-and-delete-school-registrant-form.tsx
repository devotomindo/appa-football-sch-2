"use client";

import { SubmitButton } from "@/components/buttons/submit-button";
import { useEffectEvent } from "@/lib/hooks/useEffectEvent";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import { FormEvent, startTransition, useActionState, useEffect } from "react";
import { rejectAndDeleteSchoolRegistrant } from "../action/reject-and-delete-school-registrant";

export function RejectAndDeleteSchoolRegistrantForm({
  memberId,
  onSuccess,
}: {
  memberId: string;
  onSuccess?: () => void;
}) {
  const [actionState, actionDispatch, isActionPending] = useActionState(
    rejectAndDeleteSchoolRegistrant,
    undefined,
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      const formData = new FormData();
      formData.append("memberId", memberId);

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
      <SubmitButton color="red" loading={isActionPending}>
        Tolak
      </SubmitButton>
    </form>
  );
}
