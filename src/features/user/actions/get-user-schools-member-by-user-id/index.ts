"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { schoolRoleMembers, schoolRoles, schools } from "@/db/drizzle/schema";
import { createServerClient } from "@/db/supabase/server";
import { getStorageBucketAndPath } from "@/lib/utils/supabase";
import { eq } from "drizzle-orm";
import { cache } from "react";

export type GetUserSchoolsMemberByUserIdResponse = Awaited<
  ReturnType<typeof getUserSchoolsMemberByUserId>
>;

export const getUserSchoolsMemberByUserId = cache(async function (
  userId: string,
) {
  const db = createDrizzleConnection();
  const supabase = await createServerClient();

  const results = await db
    .select({
      id: schoolRoleMembers.id,
      createdAt: schoolRoleMembers.createdAt,
      userId: schoolRoleMembers.userId,
      schoolId: schoolRoleMembers.schoolId,
      schoolRoleId: schoolRoleMembers.schoolRoleId,
      isApproved: schoolRoleMembers.isApproved,
      schoolName: schools.name,
      schoolImagePath: schools.imagePath,
      roleName: schoolRoles.name,
      schoolUpdatedAt: schools.updatedAt,
    })
    .from(schoolRoleMembers)
    .leftJoin(schools, eq(schoolRoleMembers.schoolId, schools.id))
    .leftJoin(schoolRoles, eq(schoolRoleMembers.schoolRoleId, schoolRoles.id))
    .where(eq(schoolRoleMembers.userId, userId));

  return Promise.all(
    results.map(async (result) => {
      if (!result.schoolImagePath) {
        return { ...result, schoolImageUrl: null };
      }

      const { bucket, path } = getStorageBucketAndPath(result.schoolImagePath);
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      const schoolImageUrl =
        data.publicUrl +
        (result.schoolUpdatedAt
          ? `?t=${new Date(result.schoolUpdatedAt)}`
          : "");

      return {
        ...result,
        schoolImageUrl,
      };
    }),
  );
});
