"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { countries } from "@/db/drizzle/schema";

export async function getAllCountries() {
  const db = createDrizzleConnection();

  return await db.select().from(countries);
}
