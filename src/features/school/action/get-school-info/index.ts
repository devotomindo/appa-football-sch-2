"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { schools } from "@/db/drizzle/schema";
import { createServerClient } from "@/db/supabase/server";
import { getStorageBucketAndPath } from "@/lib/utils/supabase";
import { eq } from "drizzle-orm";
import { cache } from "react";
import { SchoolWithImageUrl } from "../../types/school";

export const getSchoolInfoById = cache(async function (
  schoolId: number,
): Promise<SchoolWithImageUrl> {
  const db = createDrizzleConnection();
  const supabase = await createServerClient();

  return db
    .select()
    .from(schools)
    .where(eq(schools.id, schoolId))
    .limit(1)
    .then((res) => {
      const school = res[0];

      if (!school.imagePath) {
        return school;
      }

      const { bucket, path } = getStorageBucketAndPath(school.imagePath);

      // Fetch avatar from bucket
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);

      return {
        ...school,
        imageUrl: data.publicUrl,
      };
    });
});
