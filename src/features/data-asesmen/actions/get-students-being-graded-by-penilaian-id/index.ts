"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { assessmentRecords, userProfiles } from "@/db/drizzle/schema";
import { createServerClient } from "@/db/supabase/server";
import { calculateAge, getAgeGroup } from "@/lib/utils/age";
import { getStorageBucketAndPath } from "@/lib/utils/supabase";
import { eq } from "drizzle-orm";
import { cache } from "react";

export type GetStudentsBeingGradedByPenilaianIdResponse = Awaited<
  ReturnType<typeof getStudentsBeingGradedByPenilaianId>
>;

export const getStudentsBeingGradedByPenilaianId = cache(async function (
  penilaianId: string,
) {
  const db = createDrizzleConnection();
  const supabase = await createServerClient();

  const results = await db
    .select({
      id: assessmentRecords.id,
      userFullName: userProfiles.name,
      userAvatarPath: userProfiles.avatarPath,
      userUpdatedAt: userProfiles.updatedAt,
      userBirthDate: userProfiles.birthDate,
    })
    .from(assessmentRecords)
    .leftJoin(userProfiles, eq(assessmentRecords.studentId, userProfiles.id))
    .where(eq(assessmentRecords.assessmentSessionId, penilaianId));

  return Promise.all(
    results.map(async (result) => {
      const age = result.userBirthDate
        ? calculateAge(new Date(result.userBirthDate))
        : null;
      const ageGroup = age ? getAgeGroup(age) : null;

      if (!result.userAvatarPath) {
        return { ...result, userImageUrl: null, age, ageGroup };
      }

      const { bucket, path } = getStorageBucketAndPath(result.userAvatarPath);
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      const userImageUrl =
        data.publicUrl +
        (result.userUpdatedAt ? `?t=${new Date(result.userUpdatedAt)}` : "");

      return {
        ...result,
        userImageUrl,
        age,
        ageGroup,
      };
    }),
  );
});
