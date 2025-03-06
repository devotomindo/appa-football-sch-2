"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import {
  formationPositioning,
  formations,
  positions,
} from "@/db/drizzle/schema";
import { getImageURL } from "@/lib/utils/image-uploader";
import { eq } from "drizzle-orm";
import { cache } from "react";

export type GetEnsiklopediByIdResponse = Awaited<
  ReturnType<typeof getEnsiklopediById>
>;

export const getEnsiklopediById = cache(async function (id: string) {
  const db = createDrizzleConnection();

  return db
    .select()
    .from(formationPositioning)
    .where(eq(formationPositioning.formationId, id))
    .leftJoin(positions, eq(formationPositioning.positionId, positions.id))
    .leftJoin(formations, eq(formationPositioning.formationId, formations.id))
    .then(async (data) => {
      const gambarFormasiURL = data[0]?.formations?.defaultFormationImagePath
        ? (await getImageURL(data[0].formations.defaultFormationImagePath)) +
          `?t=${data[0].formations.updatedAt.getTime()}`
        : "";
      const gambarOffenseURL = data[0]?.formations?.offenseTransitionImagePath
        ? (await getImageURL(data[0].formations.offenseTransitionImagePath)) +
          `?t=${data[0].formations.updatedAt.getTime()}`
        : "";
      const gambarDefenseURL = data[0]?.formations?.defenseTransitionImagePath
        ? (await getImageURL(data[0].formations.defenseTransitionImagePath)) +
          `?t=${data[0].formations.updatedAt.getTime()}`
        : "";

      const daftarPosisi = await Promise.all(
        data.map(async (item) => ({
          id: item.formation_positioning.id,
          idPosisi: item.positions?.id ?? "",
          namaPosisi: item.positions?.name ?? "",
          deskripsiPosisi: item.positions?.description,
          karakteristik: item.formation_positioning.characteristics,
          prinsip: item.formation_positioning.principles,
          deskripsiOffense: item.formation_positioning.offenseDescription,
          gambarOffense: item.formation_positioning.offenseIllustrationPath
            ? await getImageURL(
                item.formation_positioning.offenseIllustrationPath +
                  `?t=${item.formation_positioning.updatedAt.getTime()}`,
              )
            : "",
          deskripsiDefense: item.formation_positioning.defenseDescription,
          gambarDefense: item.formation_positioning.defenseIllustrationPath
            ? await getImageURL(
                item.formation_positioning.defenseIllustrationPath +
                  `?t=${item.formation_positioning.updatedAt.getTime()}`,
              )
            : "",
          nomorPosisi: item.formation_positioning.positionNumber,
        })),
      );

      return {
        idFormasi: data[0]?.formations?.id ?? "",
        namaFormasi: data[0]?.formations?.name ?? "",
        gambarFormasiDefault: gambarFormasiURL,
        gambarOffense: gambarOffenseURL,
        gambarDefense: gambarDefenseURL,
        deskripsiFormasi: data[0]?.formations?.description ?? "",
        daftarPosisi: daftarPosisi.sort(
          (a, b) => a.nomorPosisi - b.nomorPosisi,
        ),
      };
    });
});
