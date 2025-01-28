"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { trainingProcedure } from "@/db/drizzle/schema";
import { createServerClient } from "@/db/supabase/server";
import { getStorageBucketAndPath } from "@/lib/utils/supabase";
import { gt } from "drizzle-orm";
import { cache } from "react";

export const getAllLatihanKelompok = cache(async function () {
  const db = createDrizzleConnection();
  const supabase = await createServerClient();

  return await db
    .select()
    .from(trainingProcedure)
    .where(gt(trainingProcedure.groupSize, 1))
    .then((res) =>
      res.map((trainingProcedure) => {
        // Fetch public url
        const videoPath = trainingProcedure.videoPath;
        const { bucket, path } = getStorageBucketAndPath(videoPath);

        const videoUrl = supabase.storage.from(bucket).getPublicUrl(path);

        return {
          ...trainingProcedure,
          videoUrl: videoUrl.data.publicUrl,
        };
      }),
    );
});
