"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { tools } from "@/db/drizzle/schema";
import { createServerClient } from "@/db/supabase/server";
import { getStorageBucketAndPath } from "@/lib/utils/supabase";
import { cache } from "react";

export type GetAllAlatLatihanResponse = Awaited<
  ReturnType<typeof getAllAlatLatihan>
>;

export const getAllAlatLatihan = cache(async function () {
  const db = createDrizzleConnection();
  const supabase = await createServerClient();

  return await db
    .select()
    .from(tools)
    .then((res) => {
      // Fetch image public url
      return res.map((tool) => {
        if (!tool.imagePath) {
          return {
            ...tool,
            // Placeholder image because passing null causes
            // Mantine React Table to throw an error
            imageUrl:
              "https://academy-sb.appa-tech.com/storage/v1/object/public/assets/no-image-placeholder.webp",
          };
        }

        const { bucket, path } = getStorageBucketAndPath(tool.imagePath);

        // Fetch avatar from bucket
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        const imageUrl = data.publicUrl + "?t=" + new Date(tool.updatedAt);

        return {
          ...tool,
          imageUrl: imageUrl,
        };
      });
    });
});

export type GetAllAlatLatihanWithoutImageResponse = Awaited<
  ReturnType<typeof getAllAlatLatihanWithoutImage>
>;

export const getAllAlatLatihanWithoutImage = cache(async function () {
  const db = createDrizzleConnection();

  return await db
    .select({
      id: tools.id,
      name: tools.name,
    })
    .from(tools);
});
