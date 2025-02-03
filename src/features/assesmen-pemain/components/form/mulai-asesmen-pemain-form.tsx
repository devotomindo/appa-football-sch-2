"use client";
import { SubmitButton } from "@/components/buttons/submit-button";
import { useEffectEvent } from "@/lib/hooks/useEffectEvent";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import { useSchoolStore } from "@/stores/school-store";
import { IconPlus } from "@tabler/icons-react";
import { redirect } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { createStudentAssessment } from "../actions/create-student-assessment";

export function MulaiAsesmenPemainForm({
  assessmentId,
  studentIds,
}: {
  assessmentId: string;
  studentIds: string[];
}) {
  const selectedSchool = useSchoolStore((state) => state.selectedSchool);
  const [actionState, actionsDispatch, isActionPending] = useActionState(
    createStudentAssessment,
    undefined,
  );

  const actionEffectEvent = useEffectEvent((state: typeof actionState) => {
    if (state) {
      formStateNotificationHelper({
        state,
        successCallback: () => {},
      });

      if (state.assessmentSessionId) {
        redirect(
          `/dashboard/asesmen-pemain/penilaian/${state.assessmentSessionId}`,
        );
      }
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
        formData.append("assessmentId", assessmentId);
        if (selectedSchool) {
          formData.append("schoolId", selectedSchool?.id);
        }
        studentIds.forEach((id) => {
          formData.append("studentIds", id);
        });

        startTransition(() => actionsDispatch(formData));
      }}
    >
      <SubmitButton
        loading={isActionPending}
        disabled={
          !assessmentId ||
          studentIds.length === 0 ||
          isActionPending ||
          !selectedSchool
        }
        leftSection={<IconPlus />}
      >
        Mulai Asesmen
      </SubmitButton>
    </form>
  );
}
