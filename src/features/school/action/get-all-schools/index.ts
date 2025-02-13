"use server";
import { createDrizzleConnection } from "@/db/drizzle/connection";
import { schools } from "@/db/drizzle/schema";
import { cache } from "react";

export const getAllSchools = cache(async function () {
  const db = createDrizzleConnection();

  return await db.select({ id: schools.id, name: schools.name }).from(schools);
});
