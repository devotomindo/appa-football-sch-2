"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { formations } from "@/db/drizzle/schema";
import { getImageURL } from "@/lib/utils/image-uploader";
import { asc } from "drizzle-orm";

export async function getAllEnsiklopediPemain() {
  const db = createDrizzleConnection();

  const formationData = await db
    .select()
    .from(formations)
    .orderBy(asc(formations.createdAt));

  const formattedData = await Promise.all(
    formationData.map(async (item) => {
      const [formasiURL, offenseURL, defenseURL] = await Promise.all([
        item.defaultFormationImagePath
          ? getImageURL(
              item.defaultFormationImagePath + `?t=${item.updatedAt.getTime()}`,
            )
          : null,
        item.offenseTransitionImagePath
          ? getImageURL(item.offenseTransitionImagePath) +
            `?t=${item.updatedAt.getTime()}`
          : null,
        item.defenseTransitionImagePath
          ? getImageURL(item.defenseTransitionImagePath) +
            `?t=${item.updatedAt.getTime()}`
          : null,
      ]);

      return {
        id: item.id,
        namaFormasi: item.name,
        gambarFormasiDefault: formasiURL,
        gambarOffense: offenseURL,
        gambarDefense: defenseURL,
        deskripsiFormasi: item.description,
      };
    }),
  );

  return formattedData;
}
