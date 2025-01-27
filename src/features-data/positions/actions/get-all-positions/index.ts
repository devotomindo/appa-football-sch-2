"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { positions } from "@/db/drizzle/schema";

export async function getAllPositions() {
  const db = createDrizzleConnection();

  return await db.select().from(positions);
}
