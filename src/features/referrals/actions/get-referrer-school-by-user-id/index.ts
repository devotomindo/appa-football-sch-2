"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { schoolRoleMembers } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getReferrerSchoolByUserId(userId: string) {
  if (!userId) return null;

  const db = createDrizzleConnection();

  const result = await db
    .select({
      schoolId: schoolRoleMembers.schoolId,
    })
    .from(schoolRoleMembers)
    .where(eq(schoolRoleMembers.userId, userId))
    .limit(1);

  return result[0] ?? null;
}
