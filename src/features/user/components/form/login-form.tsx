"use client";

import { login } from "@/features/user/actions/login";
import { Alert, Button, PasswordInput, TextInput } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { startTransition, useActionState } from "react";

export function LoginForm() {
  const [actionState, actionDispatch, isActionPending] = useActionState(
    login,
    undefined,
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        startTransition(() => {
          actionDispatch(new FormData(e.currentTarget));
        });
      }}
      className="z-10 mt-8 flex w-[50vw] flex-col justify-between gap-10 rounded-lg border bg-white px-8 pb-24 pt-10 shadow-md max-sm:w-[80vw]"
    >
      {actionState?.error?.general ? (
        <Alert variant="light" color="red" icon={<IconInfoCircle />} mb="1rem">
          {actionState.error.general}
        </Alert>
      ) : null}
      <div className="space-y-2">
        <div className="relative h-[50px] w-full">
          <Image
            src={"/logo-tanpa-teks.png"}
            alt=""
            width={500}
            height={500}
            className="mx-auto h-full w-full"
            style={{ objectFit: "contain" }}
          />
        </div>
        <p className="text-center font-bold capitalize text-[#333333]">login</p>
      </div>

      <div className="space-y-4">
        <TextInput
          label="Email"
          name="email"
          required
          withAsterisk={false}
          error={actionState?.error.email}
          className="text-[#333333] shadow-lg"
          radius="md"
        />
        <div>
          <PasswordInput
            label="Password"
            name="password"
            required
            withAsterisk={false}
            error={actionState?.error.password}
            className="text-[#333333] shadow-lg"
            radius="md"
          />
          <Link
            href="/forget-password"
            className="mt-2 block text-[#E92222] underline"
          >
            Lupa password
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-4 text-center">
        <Button
          type="submit"
          fullWidth
          className="!bg-[#28B826] shadow-xl"
          loading={isActionPending}
          size="lg"
          radius="md"
        >
          Login
        </Button>
        <p className="text-[#333333]">
          Belum punya akun,{" "}
          <Link href={"/sign-up"} className="text-[#2E3192] underline">
            buat akun baru
          </Link>
        </p>
      </div>
    </form>
  );
}
