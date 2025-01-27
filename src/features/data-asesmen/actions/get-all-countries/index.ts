"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { countries } from "@/db/drizzle/schema";

export async function GetAllCountries() {
  const db = createDrizzleConnection();

  return await db.select().from(countries);
}
