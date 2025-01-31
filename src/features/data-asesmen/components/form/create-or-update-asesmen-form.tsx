"use client";

import { getAllAssessmentCategoriesQueryOptions } from "@/features/data-asesmen/actions/get-all-assessment-categories/query-options";
import { useEffectEvent } from "@/lib/hooks/useEffectEvent";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import {
  ActionIcon,
  Button,
  Card,
  FileInput,
  Image,
  Select,
  Switch,
  Textarea,
  TextInput,
} from "@mantine/core";
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

interface StepData {
  procedure: string;
  file?: File;
  previewUrl?: string;
  hasImage: boolean; // Track if step has an image (either uploaded or existing)
}

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

  const [steps, setSteps] = useState<StepData[]>([
    { procedure: "", hasImage: false },
  ]);

  const [isHigherValueBetter, setHigherValueBetter] = useState(
    assessmentData?.isHigherGradeBetter ?? true, // Default to true if no data
  );

  // Update steps when assessment data loads
  useEffect(() => {
    if (assessmentData?.illustrations) {
      setSteps(
        assessmentData.illustrations.map((ill) => ({
          procedure: ill.procedure,
          previewUrl: ill.imageUrl,
          hasImage: true,
        })),
      );
    }
  }, [assessmentData]);

  const handleAddStep = () => {
    setSteps((prev) => [...prev, { procedure: "", hasImage: false }]);
  };

  const handleRemoveStep = (indexToRemove: number) => {
    if (steps.length > 1) {
      setSteps((prev) => {
        const newSteps = [...prev];
        if (newSteps[indexToRemove].previewUrl) {
          URL.revokeObjectURL(newSteps[indexToRemove].previewUrl!);
        }
        newSteps.splice(indexToRemove, 1);
        return newSteps;
      });
    }
  };

  const handleFileChange = (index: number, file: File | null) => {
    if (file) {
      setSteps((prev) => {
        const newSteps = [...prev];
        // Cleanup old preview URL if it exists
        if (newSteps[index].previewUrl) {
          URL.revokeObjectURL(newSteps[index].previewUrl!);
        }
        newSteps[index] = {
          ...newSteps[index],
          file,
          hasImage: true,
          previewUrl: URL.createObjectURL(file),
        };
        return newSteps;
      });
    }
  };

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      steps.forEach((step) => {
        if (step.previewUrl && step.file) {
          URL.revokeObjectURL(step.previewUrl);
        }
      });
    };
  }, [steps]);

  const router = useRouter();
  const [actionState, actionDispatch, actionIsPending] = useActionState(
    state === "create" ? createAssesment : editAssesment,
    undefined,
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      const formData = new FormData(e.currentTarget as HTMLFormElement);

      formData.append("isHigherGradeBetter", isHigherValueBetter.toString());
      // Add steps data to formData
      steps.forEach((step, index) => {
        formData.append(`steps[${index}][procedure]`, step.procedure);
        // Only append file if it's a new upload
        if (step.file) {
          formData.append(`steps[${index}][image]`, step.file);
        } else if (state === "edit") {
          // Add empty file to maintain array structure
          const emptyFile = new File([], "undefined", {
            type: "application/octet-stream",
          });
          formData.append(`steps[${index}][image]`, emptyFile);
        }
      });

      if (assessmentData?.id) {
        formData.append("assessmentId", assessmentData.id);
      }
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
        error={actionState?.error?.nama}
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
          error={actionState?.error?.kategori}
        />
        <Select
          label="Satuan Penilaian"
          data={gradingMetricsOptions}
          searchable
          name="satuan"
          value={gradingMetric}
          onChange={(value) => setGradingMetric(value)}
          error={actionState?.error?.satuan}
        />
        <Switch
          label="Nilai Semakin Tinggi Semakin Baik"
          checked={isHigherValueBetter}
          onChange={(event) =>
            setHigherValueBetter(event.currentTarget.checked)
          }
          error={actionState?.error?.isHigherGradeBetter}
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
        error={actionState?.error?.deskripsi}
      />
      <TextInput
        label="Tujuan Asesmen"
        required
        withAsterisk={false}
        name="tujuan"
        className="shadow-lg"
        radius={"md"}
        defaultValue={assessmentData?.mainGoal ?? ""}
        error={actionState?.error?.tujuan}
      />

      <div className="space-y-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-row-reverse justify-between gap-2"
          >
            <div className="flex items-end">
              {index === 0 ? (
                <ActionIcon
                  onClick={handleAddStep}
                  className="h-[36px] w-[36px] !bg-green-500 hover:!bg-green-600"
                  variant="filled"
                  radius="xl"
                >
                  <IconPlus size={16} className="text-white" />
                </ActionIcon>
              ) : (
                <ActionIcon
                  color="red"
                  variant="filled"
                  onClick={() => handleRemoveStep(index)}
                  className="h-[36px] w-[36px]"
                  radius="xl"
                >
                  <IconMinus size={16} />
                </ActionIcon>
              )}
            </div>
            <Card withBorder shadow="sm" p="md" radius="md" className="flex-1">
              <div className="grid grid-cols-[2fr,1fr] gap-4">
                <div className="space-y-4">
                  <TextInput
                    label={`Langkah Asesmen ${index + 1}`}
                    value={step.procedure}
                    onChange={(e) => {
                      const newSteps = [...steps];
                      newSteps[index].procedure = e.target.value;
                      setSteps(newSteps);
                    }}
                    required
                    className="shadow-sm"
                    radius="md"
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Gambar Ilustrasi</div>
                  <FileInput
                    accept="image/*"
                    onChange={(file) => handleFileChange(index, file)}
                    required={!step.hasImage}
                    value={null}
                    placeholder={
                      step.hasImage
                        ? "Gambar sudah diupload"
                        : "Upload Gambar Ilustrasi"
                    }
                    className="w-full"
                  />
                  {step.previewUrl && (
                    <Card withBorder p="xs">
                      <Image
                        src={step.previewUrl}
                        alt={`Preview ${index + 1}`}
                        height={200}
                        fit="contain"
                        className="rounded-md"
                      />
                    </Card>
                  )}
                </div>
              </div>
            </Card>
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
