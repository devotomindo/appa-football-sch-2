"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { schoolRoleMembers, userProfiles } from "@/db/drizzle/schema";
import { createServerClient } from "@/db/supabase/server";
import { getStorageBucketAndPath } from "@/lib/utils/supabase";
import { and, eq } from "drizzle-orm";
import { cache } from "react";

export type GetSchoolMembersBySchoolIdResponse = Awaited<
  ReturnType<typeof getSchoolMembersBySchoolId>
>;

export const getSchoolMembersBySchoolId = cache(async function (
  schoolId: string,
) {
  const db = createDrizzleConnection();
  const supabase = await createServerClient();

  const results = await db
    .select({
      id: schoolRoleMembers.id,
      createdAt: schoolRoleMembers.createdAt,
      userId: schoolRoleMembers.userId,
      userFullName: userProfiles.name,
      userAvatarPath: userProfiles.avatarPath,
      userUpdatedAt: userProfiles.updatedAt,
    })
    .from(schoolRoleMembers)
    .leftJoin(userProfiles, eq(schoolRoleMembers.userId, userProfiles.id))
    .where(
      and(
        eq(schoolRoleMembers.schoolId, schoolId),
        eq(schoolRoleMembers.isApproved, true),
      ),
    );

  return Promise.all(
    results.map(async (result) => {
      if (!result.userAvatarPath) {
        return { ...result, userImageUrl: null };
      }

      const { bucket, path } = getStorageBucketAndPath(result.userAvatarPath);
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      const userImageUrl =
        data.publicUrl +
        (result.userUpdatedAt ? `?t=${new Date(result.userUpdatedAt)}` : "");

      return {
        ...result,
        userImageUrl,
      };
    }),
  );
});
