"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { trainingProcedure } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getAllLatihanIndividu() {
  const db = createDrizzleConnection();

  return await db
    .select()
    .from(trainingProcedure)
    .where(eq(trainingProcedure.groupSize, 1));
}
