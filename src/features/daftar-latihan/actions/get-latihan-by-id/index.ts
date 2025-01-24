"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { tools, trainingProcedure, trainingTools } from "@/db/drizzle/schema";
import { createServerClient } from "@/db/supabase/server";
import { getStorageBucketAndPath } from "@/lib/utils/supabase";
import { eq, getTableColumns } from "drizzle-orm";
import { cache } from "react";

export type GetLatihanByIdResponse = Awaited<ReturnType<typeof getLatihanById>>;

export const getLatihanById = cache(async function (id: string) {
  const db = createDrizzleConnection();
  const supabase = await createServerClient();

  const result = await db
    .select({
      ...getTableColumns(trainingProcedure),
      tools: {
        id: tools.id,
        name: tools.name,
        imagePath: tools.imagePath,
        minCount: trainingTools.minCount,
      },
    })
    .from(trainingProcedure)
    .leftJoin(trainingTools, eq(trainingTools.trainingId, id))
    .leftJoin(tools, eq(tools.id, trainingTools.toolId))
    .where(eq(trainingProcedure.id, id))
    .then((res) => {
      if (res.length === 0) return null;

      // Get base training data from first result
      const { tools: _, ...baseTraining } = res[0];

      // Fetch public url for video
      const videoPath = baseTraining.videoPath;
      const { bucket, path } = getStorageBucketAndPath(videoPath);
      const videoUrl = supabase.storage.from(bucket).getPublicUrl(path);

      // Collect all tools and get their image URLs if available
      const tools = res
        .filter((row) => row.tools.id !== null)
        .map((row) => {
          const tool = row.tools;
          if (tool.imagePath) {
            const { bucket, path } = getStorageBucketAndPath(tool.imagePath);
            const imageUrl = supabase.storage.from(bucket).getPublicUrl(path);
            return {
              ...tool,
              imageUrl: imageUrl.data.publicUrl,
            };
          }
          return {
            ...tool,
            imageUrl: null,
          };
        });

      return {
        ...baseTraining,
        videoUrl: videoUrl.data.publicUrl,
        tools,
      };
    });

  return result;
});
