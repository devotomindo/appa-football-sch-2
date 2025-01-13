"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { authUsers, userProfiles } from "@/db/drizzle/schema";
import { createServerClient } from "@/db/supabase/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function SignUp(prevState: any, formData: FormData) {
  const validationResult = await zfd
    .formData({
      username: zfd.text(z.string().min(5)),
      kota: zfd.text(z.string().min(5)),
      ssb: zfd.text(z.string().min(5)),
      email: zfd.text(z.string().email()),
      password: zfd.text(z.string().min(6)),
      confirmPassword: zfd.text(),
    })
    .safeParseAsync(formData);

  // validasi error
  if (!validationResult.success) {
    const errorFormatted = validationResult.error.format() as any;
    return {
      error: {
        username: errorFormatted.username?._errors,
        kota: errorFormatted.kota?._errors,
        ssb: errorFormatted.ssb?._errors,
        email: errorFormatted.email?._errors,
        password: errorFormatted.password?._errors,
        confirmPassword: errorFormatted.confirmPassword?._errors,
      },
    };
  }

  if (
    validationResult.data.password !== validationResult.data.confirmPassword
  ) {
    return {
      error: {
        confirmPassword: ["Passwords do not match"],
      },
    };
  }

  // DATA PROCESSING
  const userEmail = validationResult.data.username + "@email.com";
  const db = createDrizzleConnection();
  const supabase = await createServerClient();

  // Check if username already exists
  const [existingUser] = await db
    .select({ id: authUsers.id })
    .from(authUsers)
    .innerJoin(userProfiles, eq(authUsers.id, userProfiles.id))
    .where(eq(authUsers.email, userEmail))
    .limit(1);

  if (existingUser) {
    return {
      error: {
        general: "Username already exists",
      },
    };
  }

  // Create user with supabase
  const { error: authError } = await supabase.auth.signUp({
    email: userEmail,
    password: validationResult.data.password,
  });

  if (authError) {
    return {
      error: {
        general: authError.message,
      },
    };
  }

  // Return success before redirect
  return {
    success: true,
    message: "Registration successful! You can now login.",
  };

  // redirect if success
  //   redirect("/login", RedirectType.replace);
}
