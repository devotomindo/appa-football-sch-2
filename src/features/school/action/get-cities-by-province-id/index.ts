"use server";
import { createDrizzleConnection } from "@/db/drizzle/connection";
import { cities } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";
import { cache } from "react";

export const getCitiesByProvinceId = cache(async function (provinceId: number) {
  const db = createDrizzleConnection();

  return await db
    .select({ id: cities.id, name: cities.name })
    .from(cities)
    .where(eq(cities.stateId, provinceId));
});
