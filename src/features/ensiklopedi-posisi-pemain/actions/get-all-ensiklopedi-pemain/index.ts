"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { formations } from "@/db/drizzle/schema";
import { getImageURL } from "@/lib/utils/image-uploader";

export async function getAllEnsiklopediPemain() {
  const db = createDrizzleConnection();

  const formationData = await db.select().from(formations);

  const formattedData = await Promise.all(
    formationData.map(async (item) => {
      const [formasiURL, offenseURL, defenseURL] = await Promise.all([
        item.defaultFormationImagePath
          ? getImageURL(item.defaultFormationImagePath)
          : null,
        item.offenseTransitionImagePath
          ? getImageURL(item.offenseTransitionImagePath)
          : null,
        item.defenseTransitionImagePath
          ? getImageURL(item.defenseTransitionImagePath)
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
