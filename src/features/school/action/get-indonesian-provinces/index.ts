"use server";
import { createDrizzleConnection } from "@/db/drizzle/connection";
import { states } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";
import { cache } from "react";

export const getIndonesianProvinces = cache(async function () {
  const db = createDrizzleConnection();

  return await db
    .select({ id: states.id, name: states.name })
    .from(states)
    .where(eq(states.countryId, 102));
});
