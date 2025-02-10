"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { packages } from "@/db/drizzle/schema";
import { cache } from "react";

export type GetAllPackagesResponse = Awaited<ReturnType<typeof getAllPackages>>;

export const getAllPackages = cache(async function () {
  const db = createDrizzleConnection();

  return await db.select().from(packages);
});
