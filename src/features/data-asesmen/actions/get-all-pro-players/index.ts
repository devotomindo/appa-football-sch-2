"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { countries, positions, proPlayers } from "@/db/drizzle/schema";
import { getImageURL } from "@/features/ensiklopedi-posisi-pemain/utils/image-uploader";
import { eq } from "drizzle-orm";

function extractParentheses(text: string | null): string | null {
  if (!text) return null;
  const matches = text.match(/\((.*?)\)/);
  return matches ? matches[1] : text;
}

export async function getAllProPlayers() {
  const db = createDrizzleConnection();

  const players = await db
    .select({
      id: proPlayers.id,
      playersName: proPlayers.playersName,
      age: proPlayers.age,
      photoPath: proPlayers.photoPath,
      positionName: positions.name,
      team: proPlayers.currentTeam,
      countryName: countries.name,
    })
    .from(proPlayers)
    .leftJoin(positions, eq(proPlayers.positionId, positions.id))
    .leftJoin(countries, eq(proPlayers.countryId, countries.id));

  const playersWithUrls = await Promise.all(
    players.map(async (player) => {
      const url = player.photoPath ? await getImageURL(player.photoPath) : null;
      return {
        ...player,
        photoPath: url,
        positionName: extractParentheses(player.positionName),
      };
    }),
  );

  return playersWithUrls;
}
