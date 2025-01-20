"use server";
import { createDrizzleConnection } from "@/db/drizzle/connection";
import { schools } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";
import { cache } from "react";

export const getSchoolByCityId = cache(async function (cityId: number | null) {
  const db = createDrizzleConnection();

  if (!cityId) {
    return [];
  }

  return await db
    .select({ id: schools.id, name: schools.name })
    .from(schools)
    .where(eq(schools.domisiliKota, cityId));
});
