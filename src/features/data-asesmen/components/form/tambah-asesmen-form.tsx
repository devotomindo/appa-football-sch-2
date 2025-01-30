"use client";

import { useEffectEvent } from "@/lib/hooks/useEffectEvent";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import { Button, Select, Textarea, TextInput } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormEvent, startTransition, useActionState, useEffect } from "react";
import { createAssesment } from "../../actions/create-assesment";
import { editAssesment } from "../../actions/edit-assesment";
import { getAssessmentByIdQueryOptions } from "../../actions/get-assesment-by-id/query-options";

export function TambahAsesmenForm({
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
  // const [langkahAsesmen, setLangkahAsesmen] = useState(
  //   assessmentData?.procedure?.length || 1,
  // );
  // const [fileNames, setFileNames] = useState<string[]>(
  //   assessmentData?.illustrationPath || [],
  // );

  // const handleAddAsesmen = () => {
  //   setLangkahAsesmen((prev) => prev + 1);
  // };

  // const handleRemoveCriteria = () => {
  //   if (langkahAsesmen > 1) {
  //     setLangkahAsesmen((prev) => prev - 1);
  //   }
  // };

  // const handleFileChange = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  // ) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     // setFileNames((prev) => {
  //     //   const newFileNames = [...prev];
  //     //   newFileNames[index] = file.name;
  //     //   return newFileNames;
  //     // });
  //   }
  // };

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
          data={[
            "fisik",
            "mental",
            "teknik",
            "taktik",
            "emosional",
            "sosial & kepemimpinan",
            "kognitif",
          ].sort((a, b) => a.localeCompare(b))}
          searchable
          name="kategori"
          // defaultValue={assessmentData?.category ?? ""}
        />
        <Select
          label="satuan"
          data={["kali", "detik", "menit", "cm", "m", "ms"].sort((a, b) =>
            a.localeCompare(b),
          )}
          searchable
          name="satuan"
          defaultValue={assessmentData?.grademetricName ?? ""}
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

      {/*
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
                  // name={`image[${index}]`}
                  name={
                    assessmentData ? `imagePath[${index}]` : `image[${index}]`
                  }
                  className="absolute inset-0 cursor-pointer opacity-0"
                  accept="image/*"
                  onChange={(e) => handleFileChange(index, e)}
                  defaultValue={fileNames[index] ?? ""}
                />
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

      */}

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
