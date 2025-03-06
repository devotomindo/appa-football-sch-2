"use client";

import { SubmitButton } from "@/components/buttons/submit-button";
import { getAllStudentsBySchoolIdQueryOptions } from "@/features/school/action/get-all-students-by-school-id/query-options";
import { getPremiumQuotaBySchoolIdQueryOptions } from "@/features/school/action/get-premium-quota-by-school-id/query-options";
import { useEffectEvent } from "@/lib/hooks/useEffectEvent";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import { useQueryClient } from "@tanstack/react-query";
import { startTransition, useActionState, useEffect } from "react";
import { deactivatePremium } from "../actions/deactivate-premium-for-student";

export function DeactivatePremiumForStudentForm({
  premiumId,
  schoolId,
  onSuccess,
}: {
  premiumId: string;
  schoolId: string; // Is used to invalidate the query and verify that student is registered to school
  onSuccess?: () => void;
}) {
  // CREATE OR UPDATE PAKET
  const [actionState, actionDispatch, isActionPending] = useActionState(
    deactivatePremium,
    undefined,
  );

  const queryClient = useQueryClient();

  const actionEffectEvent = useEffectEvent((state) => {
    if (state) {
      formStateNotificationHelper({
        state,
        successCallback: () => {
          queryClient.invalidateQueries(
            getAllStudentsBySchoolIdQueryOptions(schoolId),
          );
          queryClient.invalidateQueries(
            getPremiumQuotaBySchoolIdQueryOptions(schoolId),
          );
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
          const formData = new FormData(e.currentTarget);

          formData.append("premiumId", premiumId);

          actionDispatch(formData);
        });
      }}
    >
      <div className="mt-2 flex justify-center">
        <SubmitButton loading={isActionPending} color="red">
          Nonaktifkan Premium
        </SubmitButton>
      </div>
    </form>
  );
}
