"use client";

import { createProPlayerAssessment } from "@/features/data-asesmen/actions/create-pro-player-assessment";
import { editProPlayerAssessment } from "@/features/data-asesmen/actions/edit-pro-player-assessment";
import { getAllAssesmentQueryOptions } from "@/features/data-asesmen/actions/get-all-assesment/query-options";
import { useEffectEvent } from "@/lib/hooks/useEffectEvent";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import { Button, NumberInput, Select, TextInput } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import {
  FormEvent,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";

interface AsesmenData {
  namaAsesmen: string;
  satuan: string;
  hasilTerbaru: string;
  hasilTerbaik: string;
  idAsesmen?: string;
}

export function AsesmenPemainProForm({
  onSuccess,
  proPlayerId,
  data,
}: {
  onSuccess: () => void;
  proPlayerId: string;
  data?: AsesmenData;
}) {
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(
    null,
  );
  const [satuan, setSatuan] = useState(data?.satuan || "");
  const { data: allAssesmentData } = useQuery(getAllAssesmentQueryOptions());

  const selectedAssessmentData = allAssesmentData?.find(
    (assessment) => assessment.id === selectedAssessment,
  );

  useEffect(() => {
    if (selectedAssessmentData?.gradeMetric) {
      setSatuan(selectedAssessmentData.gradeMetric);
    }
  }, [selectedAssessmentData]);

  const [actionState, actionDispatch, actionIsPending] = useActionState(
    data ? editProPlayerAssessment : createProPlayerAssessment,
    undefined,
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
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
    <form className="space-y-8" onSubmit={handleSubmit}>
      <input hidden name="proPlayerId" defaultValue={proPlayerId} />
      <input hidden name="assessmentId" defaultValue={data?.idAsesmen} />
      <Select
        label="Pilih Asesmen"
        data={[
          ...(data?.idAsesmen
            ? [
                {
                  value: data.idAsesmen,
                  label: data.namaAsesmen,
                },
              ]
            : []),
          ...(allAssesmentData
            ?.filter((asesmen) => asesmen.name !== data?.namaAsesmen)
            .map((asesmen) => ({
              value: asesmen.id,
              label: asesmen.name ?? "",
            })) || []),
        ].sort((a, b) => a.label.localeCompare(b.label))}
        searchable
        required
        withAsterisk={false}
        className="shadow-lg"
        radius={"md"}
        name="nama"
        onChange={setSelectedAssessment}
        defaultValue={data?.idAsesmen}
      />

      <NumberInput
        label="Skor"
        required
        withAsterisk={false}
        name="skor"
        className="shadow-lg"
        radius={"md"}
        defaultValue={data?.hasilTerbaru}
      />

      <TextInput
        label="Satuan"
        value={satuan}
        readOnly
        className="shadow-lg"
        radius={"md"}
      />

      <Button
        type="submit"
        className="ml-auto !bg-green-500 hover:!bg-green-600"
        disabled={actionIsPending}
        loading={actionIsPending}
      >
        {data ? "Edit" : "Simpan"}
      </Button>
    </form>
  );
}
