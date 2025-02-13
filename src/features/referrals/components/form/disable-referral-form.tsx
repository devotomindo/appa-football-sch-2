"use client";

import { SubmitButton } from "@/components/buttons/submit-button";
import { useEffectEvent } from "@/lib/hooks/useEffectEvent";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import { startTransition, useActionState, useEffect } from "react";
import { disableReferral } from "../../actions/disable-referral";
import { GetAllReferralsResponse } from "../../actions/get-all-referrals";

type CreateReferralFormProps = {
  referralData: GetAllReferralsResponse[number];
  onSuccess?: () => void;
};

export function DisableReferralForm({
  referralData,
  onSuccess,
}: CreateReferralFormProps) {
  // Use either update or create action based on whether we have referral data
  const [actionState, actionDispatch, isActionPending] = useActionState(
    disableReferral,
    undefined,
  );

  const actionEffectEvent = useEffectEvent((state) => {
    if (state) {
      formStateNotificationHelper({
        state,
        successCallback: () => {
          if (onSuccess) onSuccess();
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
          const formData = new FormData();
          formData.append("id", referralData.id);
          actionDispatch(formData);
        });
      }}
      className="grid gap-4"
    >
      <div className="mt-4">
        <p>
          Apakah Anda yakin ingin menonaktifkan kode referral{" "}
          <span className="font-bold">{referralData.code}</span>?
        </p>
        <SubmitButton mt="sm" color="red" loading={isActionPending}>
          Disable
        </SubmitButton>
      </div>
    </form>
  );
}
