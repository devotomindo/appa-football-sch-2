"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { schoolRoles } from "@/db/drizzle/schema";
import { cache } from "react";

export type GetAllSchoolRoleResponse = Awaited<
  ReturnType<typeof getAllSchoolRole>
>;

export const getAllSchoolRole = cache(async function () {
  const db = createDrizzleConnection();

  return await db.select().from(schoolRoles);
});
