"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { trainingProcedure } from "@/db/drizzle/schema";
import { gte } from "drizzle-orm";

export async function getAllLatihanKelompok() {
  const db = createDrizzleConnection();

  return await db
    .select()
    .from(trainingProcedure)
    .where(gte(trainingProcedure.groupSize, 2));
}
