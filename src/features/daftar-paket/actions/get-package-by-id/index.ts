"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { packages } from "@/db/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { cache } from "react";

export type GetPackageByIdResponse = Awaited<ReturnType<typeof getPackageById>>;

export const getPackageById = cache(async function (id: string) {
  const db = createDrizzleConnection();

  return await db
    .select()
    .from(packages)
    .where(and(eq(packages.id, id), eq(packages.isDeleted, false)))
    .orderBy(packages.price)
    .then((res) => res[0]);
});
