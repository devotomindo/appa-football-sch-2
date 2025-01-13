"use client";

import { Alert, Button, PasswordInput, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconInfoCircle } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { SignUp } from "../../actions/sign-up";

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 48 48"
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
);

export function SignUpForm() {
  const router = useRouter();
  const [actionState, actionDispatch, isActionPending] = useActionState(
    SignUp,
    undefined,
  );

  useEffect(() => {
    if (actionState?.success) {
      notifications.show({
        title: "Success",
        message: actionState.message,
        color: "green",
        icon: <IconCheck />,
        autoClose: 3000,
      });
      router.push("/login");
    }
  }, [actionState?.success, actionState?.message, router]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(() => {
          actionDispatch(new FormData(e.currentTarget));
        });
      }}
      className="z-10 mt-8 flex flex-col justify-between gap-5 rounded-lg border bg-white px-20 py-10 text-black shadow-md max-sm:w-[80vw] lg:w-[60vw] xl:w-[50vw]"
    >
      {actionState?.error?.general ? (
        <Alert variant="light" color="red" icon={<IconInfoCircle />} mb="1rem">
          {actionState.error.general}
        </Alert>
      ) : null}

      <div className="mb-12 space-y-2">
        <div className="relative h-[75px] w-full">
          <Image
            src={"/logo-tanpa-teks.png"}
            alt=""
            width={500}
            height={500}
            className="mx-auto h-full w-full"
            style={{ objectFit: "contain" }}
          />
        </div>
        <p className="text-center text-3xl font-bold capitalize text-[#333333]">
          register akun baru
        </p>
      </div>

      <TextInput
        label="EMAIL"
        name="email"
        required
        error={actionState?.error?.email}
        withAsterisk={false}
        className="shadow-lg"
        labelProps={{ style: { marginBottom: "0.5rem" } }}
      />
      <PasswordInput
        label="PASSWORD"
        name="password"
        required
        error={actionState?.error?.password}
        withAsterisk={false}
        className="shadow-lg"
        labelProps={{ style: { marginBottom: "0.5rem" } }}
      />
      <PasswordInput
        label="TULIS ULANG PASSWORD"
        name="confirmPassword"
        required
        error={actionState?.error?.confirmPassword}
        withAsterisk={false}
        className="shadow-lg"
        labelProps={{ style: { marginBottom: "0.5rem" } }}
      />

      <Button
        type="submit"
        fullWidth
        className="mt-12 !bg-[#28B826] shadow-lg transition-colors hover:!bg-[#219A1F]"
        loading={isActionPending}
        size="lg"
      >
        Buat Akun
      </Button>

      <div className="relative my-4 text-center">
        <hr className="border-gray-300" />
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-4 text-sm text-gray-500">
          atau
        </span>
      </div>

      <Button
        fullWidth
        variant="outline"
        leftSection={<GoogleIcon />}
        className="!border-gray-300 !text-gray-700 shadow-lg transition-colors hover:!bg-gray-50"
        size="lg"
      >
        Masuk dengan Google
      </Button>
    </form>
  );
}
