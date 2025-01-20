"use client";
import { SubmitButton } from "@/components/buttons/submit-button";
import { FileInput, TextInput } from "@mantine/core";
import Image from "next/image";
import { startTransition, useActionState, useState } from "react";
import { GetUserByIdResponse } from "../../actions/get-user-by-id";
import { updateProfile } from "../../actions/update-profile";

export function UserProfileUpdateForm({
  userData,
}: {
  userData: GetUserByIdResponse & { avatarUrl?: string };
}) {
  const [fileValue, setFileValue] = useState<File | null>(null);
  const fileUrl = fileValue ? URL.createObjectURL(fileValue) : null;

  const [actionState, actionDispatch, isActionPending] = useActionState(
    updateProfile,
    undefined,
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        startTransition(() => {
          const formData = new FormData(e.currentTarget);
          formData.append("id", userData.id);

          actionDispatch(formData);
        });
      }}
    >
      <div className="space-y-4">
        <FileInput
          name="profilePic"
          label="Foto Profil"
          accept="image/png, image/jpg, image/webp"
          onChange={setFileValue}
          error={actionState?.error?.profilePic}
        />
        {(userData.avatarUrl || fileValue) && (
          <Image
            src={fileUrl ?? userData.avatarUrl ?? ""}
            alt="Profile Picture"
            width={200}
            height={200}
          />
        )}
        <TextInput
          defaultValue={userData.name ?? undefined}
          name="name"
          label="Nama Lengkap"
          required
          error={actionState?.error?.name}
        />
        <SubmitButton fullWidth loading={isActionPending}>
          Simpan
        </SubmitButton>
      </div>
    </form>
  );
}
