"use client";

import { useEffectEvent } from "@/lib/hooks/useEffectEvent";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import { ActionIcon } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { FormEvent, startTransition, useActionState, useEffect } from "react";
import { checkReferral } from "../../action/check-referral";

export function CheckReferralForm({
  referralCode,
  packageId,
  onSuccess,
}: {
  referralCode: string;
  packageId: string;
  onSuccess?: (result?: { discount: number }) => void;
}) {
  const [actionState, actionDispatch, isActionPending] = useActionState(
    checkReferral,
    undefined,
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      const formData = new FormData();
      formData.append("referralCode", referralCode);
      formData.append("packageId", packageId);

      actionDispatch(formData);
    });
  };

  const actionEffectEvent = useEffectEvent((state: typeof actionState) => {
    if (state) {
      formStateNotificationHelper({
        state,
        successCallback: () => {
          // Pass the discount back to parent
          if ("discount" in state) {
            onSuccess?.({ discount: state.discount });
          }
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
      <ActionIcon
        disabled={referralCode === ""}
        size={"input-sm"}
        type="submit"
        loading={isActionPending}
      >
        <IconSearch />
      </ActionIcon>
    </form>
  );
}
