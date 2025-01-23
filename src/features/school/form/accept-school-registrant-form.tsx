"use client";

import { SubmitButton } from "@/components/buttons/submit-button";
import { useEffectEvent } from "@/lib/hooks/useEffectEvent";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import { FormEvent, startTransition, useActionState, useEffect } from "react";
import { acceptSchoolRegistrant } from "../action/accept-school-registrant";

export function AcceptSchoolRegistrantForm({
  memberId,
  onSuccess,
}: {
  memberId: string;
  onSuccess?: () => void;
}) {
  const [actionState, actionDispatch, isActionPending] = useActionState(
    acceptSchoolRegistrant,
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
      <SubmitButton loading={isActionPending}>Terima</SubmitButton>
    </form>
  );
}
