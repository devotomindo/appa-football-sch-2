"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import {
  cities,
  schoolRoleMembers,
  states,
  userProfiles,
} from "@/db/drizzle/schema";
import { createServerClient } from "@/db/supabase/server";
import { getStorageBucketAndPath } from "@/lib/utils/supabase";
import { eq } from "drizzle-orm";
import { cache } from "react";

export type getBiodataPemainByStudentIdResponse = Awaited<
  ReturnType<typeof getBiodataPemainByStudentId>
>;

export const getBiodataPemainByStudentId = cache(async function (
  studentId: string,
) {
  const db = createDrizzleConnection();
  const supabase = await createServerClient();

  const biodata = await db
    .select({
      id: userProfiles.id,
      name: userProfiles.name,
      birthDate: userProfiles.birthDate,
      isMale: userProfiles.isMale,
      bodyHeight: userProfiles.bodyHeight,
      bodyWeight: userProfiles.bodyWeight,
      avatarPath: userProfiles.avatarPath,
      domisiliProvinsi: states.name,
      domisiliKota: cities.name,
      updatedAt: userProfiles.updatedAt,
    })
    .from(schoolRoleMembers)
    .innerJoin(userProfiles, eq(schoolRoleMembers.userId, userProfiles.id))
    .leftJoin(states, eq(userProfiles.domisiliProvinsi, states.id))
    .leftJoin(cities, eq(userProfiles.domisiliKota, cities.id))
    .where(eq(schoolRoleMembers.id, studentId))
    .limit(1)
    .then((result) => {
      const bio = result[0];

      if (!bio.avatarPath) {
        return {
          ...bio,
          avatarUrl: null,
        };
      }

      const { bucket, path } = getStorageBucketAndPath(bio.avatarPath);
      const fetchedUrl = supabase.storage.from(bucket).getPublicUrl(path);
      const avatarUrl =
        fetchedUrl.data.publicUrl + `?t=${bio.updatedAt.toISOString()}`;

      return {
        ...bio,
        avatarUrl,
      };
    });

  return biodata;
});
