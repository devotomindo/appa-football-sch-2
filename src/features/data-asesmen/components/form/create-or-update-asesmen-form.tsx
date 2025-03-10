"use client";

import { getAllAlatLatihanWithoutImageQueryOptions } from "@/features/daftar-alat-latihan/actions/get-all-alat-latihan/query-options";
import { getAllAssessmentCategoriesQueryOptions } from "@/features/data-asesmen/actions/get-all-assessment-categories/query-options";
import { useEffectEvent } from "@/lib/hooks/useEffectEvent";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import {
  ActionIcon,
  Alert,
  Button,
  Card,
  FileInput,
  Image,
  NumberInput,
  Select,
  Switch,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconInfoCircle, IconMinus, IconPlus } from "@tabler/icons-react";
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

  const assessmentTools = useQuery(getAllAlatLatihanWithoutImageQueryOptions());

  const [alat, setAlat] = useState<Array<{ id: string; quantity: number }>>(
    assessmentData?.tools?.length
      ? assessmentData.tools.map((tool) => ({
          id: tool.id ?? "",
          quantity: tool.minCount ?? 1,
        }))
      : [{ id: "", quantity: 1 }],
  );

  const [needsTools, setNeedsTools] = useState(
    assessmentData?.tools?.length ? true : false,
  );

  const handleAddAlat = () => {
    setAlat([...alat, { id: "", quantity: 1 }]);
  };

  const handleAlatChange = (value: string | null, index: number) => {
    const newAlat = [...alat];
    newAlat[index] = { ...newAlat[index], id: value || "" };
    setAlat(newAlat);
  };

  const handleQuantityChange = (value: number, index: number) => {
    const newAlat = [...alat];
    newAlat[index] = { ...newAlat[index], quantity: value as number };
    setAlat(newAlat);
  };

  const handleRemoveAlat = (index: number) => {
    if (alat.length > 1) {
      const newAlat = alat.filter((_, i) => i !== index);
      setAlat(newAlat);
    }
  };

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

      // Remove any existing steps data to avoid duplicates
      for (const pair of formData.entries()) {
        if (pair[0].startsWith("steps[")) {
          formData.delete(pair[0]);
        }
      }

      formData.append("isHigherGradeBetter", isHigherValueBetter.toString());

      // Add steps data to formData
      let validStepCount = 0;
      steps.forEach((step, index) => {
        if (step.procedure && (step.file || step.hasImage)) {
          formData.append(
            `steps[${validStepCount}][procedure]`,
            step.procedure,
          );

          // Only append file if it's a new upload
          if (step.file) {
            formData.append(`steps[${validStepCount}][image]`, step.file);
            validStepCount++;
          } else if (state === "edit" && step.previewUrl) {
            // For edit mode, handle existing images
            const emptyFile = new File(
              [new Uint8Array(10)],
              "placeholder.jpg",
              {
                type: "image/jpeg",
              },
            );
            formData.append(`steps[${validStepCount}][image]`, emptyFile);
            validStepCount++;
          }
        }
      });

      // Only include non-empty tool entries
      if (needsTools) {
        const validTools = alat.filter((tool) => tool.id !== "");
        formData.append("tools", JSON.stringify(validTools));
      } else {
        formData.append("no_tools_needed", "true");
      }

      if (assessmentData?.id) {
        formData.append("assessmentId", assessmentData.id);
      }

      actionDispatch(formData);
    });
  };

  const actionEffectEvent = useEffectEvent((state: typeof actionState) => {
    if (state) {
      // Transform state to match the expected structure
      const transformedState = state.error
        ? {
            error: {
              general:
                state.error.general ||
                state.error.tools?.[0] ||
                state.error.nama ||
                state.error.kategori ||
                state.error.satuan ||
                state.error.deskripsi ||
                state.error.tujuan ||
                state.error.langkahAsesmen ||
                state.error.isHigherGradeBetter ||
                "Ada kesalahan pada input",
            },
          }
        : { message: state.message || "Operasi berhasil" };

      formStateNotificationHelper({
        state: transformedState,
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

  // Helper function to get available tools (excluding already selected ones)
  const getAvailableTools = (currentIndex: number) => {
    const selectedTools = alat
      .map((item, idx) => (idx !== currentIndex ? item.id : null))
      .filter((id): id is string => id !== null && id !== "");

    return (
      assessmentTools.data
        ?.filter((item) => !selectedTools.includes(item.id))
        .map((item) => ({
          value: item.id,
          label: item.name,
        })) || []
    );
  };

  return (
    <form
      className="space-y-4 sm:space-y-6 md:space-y-8"
      onSubmit={handleSubmit}
    >
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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 md:gap-8">
        <Select
          label="Pilih Kategori"
          data={categoryOptions}
          searchable
          required
          clearable={false}
          name="kategori"
          className="flex-1"
          value={assessmentCategory}
          onChange={(value) => setAssessmentCategory(value)}
          error={actionState?.error?.kategori}
        />
        <Select
          label="Satuan Penilaian"
          data={gradingMetricsOptions}
          searchable
          name="satuan"
          className="flex-1"
          value={gradingMetric}
          onChange={(value) => setGradingMetric(value)}
          error={actionState?.error?.satuan}
        />
        <Switch
          label="Nilai Semakin Tinggi Semakin Baik"
          className="mt-4 sm:mt-0"
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

      <div className="space-y-4 sm:space-y-6">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 sm:flex-row-reverse sm:items-start sm:justify-between"
          >
            <div className="flex items-center justify-end gap-2 sm:w-[90px]">
              {index === steps.length - 1 && (
                <>
                  <ActionIcon
                    onClick={handleAddStep}
                    className="h-[36px] w-[36px] !bg-green-500 hover:!bg-green-600"
                    variant="filled"
                    radius="xl"
                  >
                    <IconPlus size={16} className="text-white" />
                  </ActionIcon>
                  {steps.length > 1 && (
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
                </>
              )}
              {index !== steps.length - 1 && <div className="w-[90px]" />}
            </div>

            <Card withBorder shadow="sm" p="md" radius="md" className="flex-1">
              <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
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
                  <FileInput
                    accept="image/*"
                    onChange={(file) => handleFileChange(index, file)}
                    required
                    label="Gambar Ilustrasi"
                    value={null}
                    placeholder={
                      step.hasImage ? "Gambar sudah diupload" : "Upload Gambar"
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

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Kebutuhan Alat</h3>
          {actionState?.error?.tools && (
            <Alert icon={<IconInfoCircle />} color="red">
              {actionState.error.tools[0]}
            </Alert>
          )}
          <Switch
            label="Membutuhkan Alat"
            checked={needsTools}
            onChange={(event) => setNeedsTools(event.currentTarget.checked)}
          />
        </div>

        {needsTools && (
          <>
            <div className="flex items-center gap-2">
              <ActionIcon
                variant="filled"
                color="blue"
                onClick={handleAddAlat}
                size="sm"
              >
                <IconPlus size={16} />
              </ActionIcon>
            </div>
            {alat.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <Select
                  placeholder="Pilih alat latihan"
                  data={getAvailableTools(index)}
                  value={item.id}
                  onChange={(value) => handleAlatChange(value, index)}
                  className="flex-1 shadow-lg"
                  radius="md"
                  name={`tool_${index}`} // Change name to be more descriptive but won't be used
                />
                <NumberInput
                  placeholder="Jumlah"
                  value={item.quantity}
                  onChange={(value) =>
                    handleQuantityChange(
                      value ? parseInt(value.toString()) : 1,
                      index,
                    )
                  }
                  min={1}
                  className="w-24 shadow-lg"
                  radius="md"
                  name={`quantity_${index}`} // Change name to be more descriptive but won't be used
                />
                {alat.length > 1 && (
                  <ActionIcon
                    variant="filled"
                    color="red"
                    onClick={() => handleRemoveAlat(index)}
                    size="sm"
                  >
                    <IconMinus size={16} />
                  </ActionIcon>
                )}
              </div>
            ))}
          </>
        )}
      </div>

      <div className="flex justify-end pt-4 sm:pt-6">
        <Button
          type="submit"
          className="w-full !bg-green-500 hover:!bg-green-600 sm:w-auto"
          disabled={actionIsPending}
          loading={actionIsPending}
        >
          {state === "create" ? "Simpan" : "Edit"}
        </Button>
      </div>
    </form>
  );
}
