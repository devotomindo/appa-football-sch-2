"use client";

import { getAllAssessmentCategoriesQueryOptions } from "@/features/data-asesmen/actions/get-all-assessment-categories/query-options";
import { useEffectEvent } from "@/lib/hooks/useEffectEvent";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import { ActionIcon, Button, Select, Textarea, TextInput } from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  FormEvent,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { createAssesment } from "../../actions/create-assesment";
import { editAssesment } from "../../actions/edit-assesment";
import { getAllGradeMetricsQueryOptions } from "../../actions/get-all-grade-metrics/query-options";
import { getAssessmentByIdQueryOptions } from "../../actions/get-assesment-by-id/query-options";

export function CreateOrUpdateAsesmenForm({
  state,
  id,
}: {
  state: "create" | "edit";
  id?: string;
}) {
  const { data: assessmentData } = useQuery({
    ...getAssessmentByIdQueryOptions(id ?? ""),
    enabled: Boolean(id),
  });

  const router = useRouter();
  const [langkahAsesmen, setLangkahAsesmen] = useState(
    assessmentData?.procedure?.length || 1,
  );
  const [fileNames, setFileNames] = useState<string[]>(
    assessmentData?.illustrationPath || [],
  );

  const handleAddAsesmen = () => {
    setLangkahAsesmen((prev) => prev + 1);
  };

  const handleRemoveCriteria = () => {
    if (langkahAsesmen > 1) {
      setLangkahAsesmen((prev) => prev - 1);
    }
  };

  const handleFileChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      setFileNames((prev) => {
        const newFileNames = [...prev];
        newFileNames[index] = file.name;
        return newFileNames;
      });
    }
  };

  const [actionState, actionDispatch, actionIsPending] = useActionState(
    state === "create" ? createAssesment : editAssesment,
    undefined,
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      formData.append("assessmentId", assessmentData?.id ?? "");
      actionDispatch(formData);
    });
  };

  const actionEffectEvent = useEffectEvent((state: typeof actionState) => {
    if (state) {
      formStateNotificationHelper({
        state,
        successCallback: () => {
          router.replace("/dashboard/admin/data-asesmen");
        },
      });
    }
  });

  useEffect(
    () => actionEffectEvent(actionState),
    [actionState, actionEffectEvent],
  );

  // Start of Assessment Categories
  const { data: assessmentCategories } = useQuery(
    getAllAssessmentCategoriesQueryOptions(),
  );

  const categoryOptions: { value: string; label: string }[] =
    assessmentCategories?.map((category) => ({
      value: category.id.toString(),
      label: category.name,
    })) || [];

  const [assessmentCategory, setAssessmentCategory] = useState(
    assessmentData?.categoryId ? assessmentData?.categoryId.toString() : null,
  );
  // End of Assessment Categories

  // Start of Grading Metrics
  const { data: gradingMetrics } = useQuery(getAllGradeMetricsQueryOptions());

  const gradingMetricsOptions: { value: string; label: string }[] =
    gradingMetrics?.map((metric) => ({
      value: metric.id.toString(),
      label: metric.name,
    })) || [];

  const [gradingMetric, setGradingMetric] = useState(
    assessmentData?.gradeMetricId
      ? assessmentData?.gradeMetricId.toString()
      : null,
  );
  // End of Grading Metrics

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <TextInput
        label="Nama Asesmen"
        required
        withAsterisk={false}
        name="nama"
        className="shadow-lg"
        radius={"md"}
        defaultValue={assessmentData?.name ?? ""}
      />

      <div className="flex items-center gap-8">
        <Select
          label="Pilih Kategori"
          data={categoryOptions}
          searchable
          required
          clearable={false}
          name="kategori"
          value={assessmentCategory}
          onChange={(value) => setAssessmentCategory(value)}
        />
        <Select
          label="satuan"
          data={gradingMetricsOptions}
          searchable
          name="satuan"
          value={gradingMetric}
          onChange={(value) => setGradingMetric(value)}
        />
      </div>

      <Textarea
        label="Deskripsi Asesmen"
        required
        withAsterisk={false}
        name="deskripsi"
        className="shadow-lg"
        radius={"md"}
        defaultValue={assessmentData?.description ?? ""}
      />
      <TextInput
        label="Tujuan Asesmen"
        required
        withAsterisk={false}
        name="tujuan"
        className="shadow-lg"
        radius={"md"}
        defaultValue={assessmentData?.mainGoal ?? ""}
      />

      <div className="space-y-4">
        {[...Array(langkahAsesmen)].map((_, index) => (
          <div key={index} className="flex items-end gap-4">
            <div className="flex-1">
              <TextInput
                label={index === 0 ? "Langkah Asesmen" : ""}
                name={`langkahAsesmen[${index}]`}
                required
                className="shadow-lg"
                radius="md"
                defaultValue={assessmentData?.procedure?.[index] ?? ""}
              />
            </div>
            <div className="w-[400px]">
              <label
                className={`block text-sm ${index === 0 ? "visible" : "invisible"}`}
              >
                Gambar Ilustrasi
              </label>
              <div className="relative h-[36px] w-full rounded-md border-2 border-dashed">
                <input
                  type="file"
                  name="image[]"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  accept="image/*"
                  onChange={(e) => handleFileChange(index, e)}
                />
                {/* Add a hidden input to preserve existing image paths */}
                {assessmentData && (
                  <input
                    type="hidden"
                    name="existingImage[]"
                    value={assessmentData?.illustrationPath?.[index] || ""}
                  />
                )}
                <div className="flex h-full items-center justify-center">
                  <p className="truncate px-2 text-sm text-gray-500">
                    {fileNames[index] || "Upload Gambar Ilustrasi"}
                  </p>
                </div>
              </div>
            </div>
            {index === 0 ? (
              <div className="flex items-end">
                <ActionIcon
                  onClick={handleAddAsesmen}
                  className="h-[36px] w-[36px] !bg-green-500 hover:!bg-green-600"
                  variant="filled"
                  radius="xl"
                >
                  <IconPlus size={16} className="text-white" />
                </ActionIcon>
              </div>
            ) : (
              <div className="flex items-end">
                <ActionIcon
                  color="red"
                  variant="filled"
                  onClick={() => handleRemoveCriteria()}
                  className="h-[36px] w-[36px]"
                  radius="xl"
                >
                  <IconMinus size={16} />
                </ActionIcon>
              </div>
            )}
          </div>
        ))}
      </div>

      <Button
        type="submit"
        className="ml-auto !bg-green-500 hover:!bg-green-600"
        disabled={actionIsPending}
        loading={actionIsPending}
      >
        {state === "create" ? "Simpan" : "Edit"}
      </Button>
    </form>
  );
}
