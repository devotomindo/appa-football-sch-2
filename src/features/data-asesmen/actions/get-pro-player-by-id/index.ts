"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { countries, positions, proPlayers } from "@/db/drizzle/schema";
import { getImageURL } from "@/lib/utils/image-uploader";
import { eq } from "drizzle-orm";
import { cache } from "react";

export const getProPlayerById = cache(async function (id: string) {
  const db = createDrizzleConnection();

  const [data] = await db
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
      positionId: proPlayers.positionId,
      countryId: proPlayers.countryId,
    })
    .from(proPlayers)
    .where(eq(proPlayers.id, id))
    .leftJoin(positions, eq(proPlayers.positionId, positions.id))
    .leftJoin(countries, eq(proPlayers.countryId, countries.id))
    .limit(1);

  if (data.photoPath) {
    return getImageURL(data.photoPath).then((url) => {
      return {
        ...data,
        photoUrl: url,
      };
    });
  }

  return {
    ...data,
    photoUrl: undefined,
  };
});
