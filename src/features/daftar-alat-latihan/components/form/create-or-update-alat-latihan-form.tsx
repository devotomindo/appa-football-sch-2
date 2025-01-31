"use client";

import { SubmitButton } from "@/components/buttons/submit-button";
import { useEffectEvent } from "@/lib/hooks/useEffectEvent";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import { FileInput, TextInput } from "@mantine/core";
import Image from "next/image";
import {
  FormEvent,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { createTool } from "../../actions/create-alat-latihan";
import { GetAllAlatLatihanResponse } from "../../actions/get-all-alat-latihan";
import { updateTool } from "../../actions/update-alat-latihan";

export function CreateOrUpdateAlatLatihanForm({
  toolData,
  onSuccess,
}: {
  toolData?: GetAllAlatLatihanResponse[number];
  onSuccess?: () => void;
}) {
  const [fileValue, setFileValue] = useState<File | null>(null);

  const fileUrl = fileValue ? URL.createObjectURL(fileValue) : null;

  const [actionState, actionDispatch, isActionPending] = useActionState(
    toolData ? updateTool : createTool,
    undefined,
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      if (toolData) {
        formData.append("id", toolData.id);
      }

      if (fileValue) {
        formData.append("image", fileValue);
      }

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
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <TextInput
          name="name"
          label="Nama Alat Latihan"
          defaultValue={toolData?.name}
          required
        />
        <FileInput
          label="Gambar Alat"
          onChange={setFileValue}
          accept="image/*"
        />
        {(toolData?.imageUrl || fileValue) && toolData?.imagePath && (
          <Image
            src={fileUrl ?? toolData?.imageUrl ?? ""}
            alt="Profile Picture"
            width={200}
            height={200}
          />
        )}
        <SubmitButton loading={isActionPending}>Simpan</SubmitButton>
      </div>
    </form>
  );
}
