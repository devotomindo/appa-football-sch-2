"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { positions } from "@/db/drizzle/schema";
import { cache } from "react";

export const getAllPositions = cache(async function () {
  const db = createDrizzleConnection();

  return await db.select().from(positions);
});
