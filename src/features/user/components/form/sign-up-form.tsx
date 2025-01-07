"use client";

import { Alert, Button, PasswordInput, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconInfoCircle } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect } from "react";
import { SignUp } from "../../actions/sign-up";

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
      className="mt-8 rounded-lg border p-8 shadow-md"
    >
      {actionState?.error?.general ? (
        <Alert variant="light" color="red" icon={<IconInfoCircle />} mb="1rem">
          {actionState.error.general}
        </Alert>
      ) : null}

      <TextInput
        label="Username"
        name="username"
        required
        error={actionState?.error?.username}
      />
      <PasswordInput
        label="Password"
        name="password"
        className="mt-4"
        required
        error={actionState?.error?.password}
      />
      <PasswordInput
        label="Confirm Password"
        name="confirmPassword"
        className="mt-4"
        required
        error={actionState?.error?.confirmPassword}
      />

      <Button
        type="submit"
        fullWidth
        className="mt-12"
        loading={isActionPending}
      >
        Sign Up
      </Button>
    </form>
  );
}
