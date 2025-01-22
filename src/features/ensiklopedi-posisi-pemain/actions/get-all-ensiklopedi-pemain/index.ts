"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { formations } from "@/db/drizzle/schema";

export async function getAllEnsiklopediPemain() {
  const db = createDrizzleConnection();

  return await db.select().from(formations);
}
