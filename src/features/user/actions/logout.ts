"use server";

import { createServerClient } from "@/db/supabase/server";
import { setSchoolSession } from "@/lib/session";
import { redirect, RedirectType } from "next/navigation";

export async function logout() {
  const supabase = await createServerClient();

  // Clear school session cookie
  await setSchoolSession(null);

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
  }

  redirect("/", RedirectType.replace);
}
