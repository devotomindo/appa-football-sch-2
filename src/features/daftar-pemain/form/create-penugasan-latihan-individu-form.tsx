"use client";

import { useEffectEvent } from "@/lib/hooks/useEffectEvent";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import { Button, Group, Select, Stack } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { startTransition, useActionState, useEffect } from "react";
import { getAllLatihanIndividu } from "../../daftar-latihan/actions/get-all-latihan-individu";
import { createPenugasanLatihanIndividu } from "../actions/create-penugasan-latihan-individu";

type Props = {
  studentId: string;
  onSuccess?: () => void;
};

export function CreatePenugasanLatihanIndividuForm({
  studentId,
  onSuccess,
}: Props) {
  const [actionState, actionDispatch, isActionPending] = useActionState(
    createPenugasanLatihanIndividu,
    undefined,
  );

  const trainingQuery = useQuery({
    queryKey: ["latihan-individu"],
    queryFn: getAllLatihanIndividu,
  });

  const trainingOptions =
    trainingQuery.data?.map((training) => ({
      value: training.id,
      label: training.name,
    })) || [];

  const actionEffectEvent = useEffectEvent((state: typeof actionState) => {
    if (state) {
      formStateNotificationHelper({
        state,
        successCallback: () => {
          if (onSuccess) {
            onSuccess();
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
    <form
      onSubmit={(e) => {
        e.preventDefault();

        startTransition(() => {
          const formData = new FormData(e.currentTarget);
          formData.append("studentId", studentId);

          actionDispatch(formData);
        });
      }}
    >
      <Stack>
        <Select
          label="Latihan"
          placeholder="Pilih latihan"
          name="trainingId"
          data={trainingOptions}
          required
          error={actionState?.error?.general}
          disabled={trainingQuery.isLoading}
        />

        <Group justify="flex-end">
          <Button type="submit" loading={isActionPending}>
            Tugaskan Latihan
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
