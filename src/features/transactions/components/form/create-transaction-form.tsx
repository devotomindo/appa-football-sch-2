"use client";

import { SubmitButton } from "@/components/buttons/submit-button";
import { useEffectEvent } from "@/lib/hooks/useEffectEvent";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import { useRouter } from "next/navigation";
import { FormEvent, startTransition, useActionState, useEffect } from "react";
import { createTransaction } from "../../action/create-transaction";

export function CreateTransactionForm({
  userId,
  schoolId,
  referralCode,
  packageId,
  finalPrice,
  onSuccess,
  disabled,
}: {
  userId: string;
  schoolId: string;
  referralCode?: string;
  packageId: string;
  finalPrice: number;
  onSuccess?: () => void;
  disabled: boolean;
}) {
  const router = useRouter();
  const [actionState, actionDispatch, isActionPending] = useActionState(
    createTransaction,
    undefined,
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("schoolId", schoolId);
      formData.append("packageId", packageId);
      if (referralCode) {
        formData.append("referralCode", referralCode);
      }
      formData.append("finalPrice", finalPrice.toString());

      actionDispatch(formData);
    });
  };

  const actionEffectEvent = useEffectEvent((state: typeof actionState) => {
    if (state) {
      formStateNotificationHelper({
        state,
        successCallback: () => {
          if (state.data?.orderId) {
            router.push(`/dashboard/payment/${state.data.orderId}`);
          }
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
      <SubmitButton fullWidth loading={isActionPending} disabled={disabled}>
        Konfirmasi Pesanan
      </SubmitButton>
    </form>
  );
}
