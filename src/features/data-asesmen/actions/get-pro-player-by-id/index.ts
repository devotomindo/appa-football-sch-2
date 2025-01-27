"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { countries, positions, proPlayers } from "@/db/drizzle/schema";
import { getImageURL } from "@/features/ensiklopedi-posisi-pemain/utils/image-uploader";
import { eq } from "drizzle-orm";
import { cache } from "react";

export const getProPlayerById = cache(async function (id: string) {
  const db = createDrizzleConnection();

  const data = await db
    .select({
      id: proPlayers.id,
      playersName: proPlayers.playersName,
      age: proPlayers.age,
      photoPath: proPlayers.photoPath,
      positionName: positions.name,
      weight: proPlayers.weight,
      height: proPlayers.height,
      currentTeam: proPlayers.currentTeam,
      countryName: countries.name,
    })
    .from(proPlayers)
    .where(eq(proPlayers.id, id))
    .leftJoin(positions, eq(proPlayers.positionId, positions.id))
    .leftJoin(countries, eq(proPlayers.countryId, countries.id))
    .limit(1)
    .then((res) => {
      const player = res[0];

      if (player.photoPath) {
        return getImageURL(player.photoPath).then((url) => {
          return {
            ...player,
            photoPath: url,
          };
        });
      }

      return {
        ...player,
      };
    });

  //   const playersWithUrls = await Promise.all(
  //     data.map(async (player) => {
  //       const url = player.photoPath ? await getImageURL(player.photoPath) : null;
  //       return {
  //         ...player,
  //         photoPath: url,
  //       };
  //     }),
  //   );

  return data;
});
