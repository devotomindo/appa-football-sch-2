"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { formationPositioning, formations } from "@/db/drizzle/schema";
import {
  multipleImageUploader,
  singleImageUploader,
} from "@/lib/utils/image-uploader";
import { revalidatePath } from "next/cache";
import { v7 as uuidv7 } from "uuid";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function createEnskilopediPemain(
  prevState: any,
  formData: FormData,
) {
  const validationResult = await zfd
    .formData({
      nama: zfd.text(
        z
          .string()
          .min(3, "Nama formasi minimal 3 karakter")
          .max(3, "Nama formasi maksimal 3 karakter"),
      ),
      deskripsi: zfd.text(z.string().min(1)),
      posisi: zfd.repeatable(
        z.array(zfd.repeatable(z.array(z.string().nonempty()))),
      ),
      karakter: zfd.repeatable(
        z.array(zfd.repeatable(z.array(z.string().min(1)))),
      ),
      posisiMenyerang: zfd.repeatable(
        z.array(zfd.repeatable(z.array(z.string()))).optional(),
      ),
      posisiBertahan: zfd.repeatable(
        z.array(zfd.repeatable(z.array(z.string()))).optional(),
      ),
      gambarPosisiMenyerang: zfd.repeatable(
        z.array(zfd.file(z.instanceof(File).optional())),
      ),
      gambarPosisiBertahan: zfd.repeatable(
        z.array(zfd.file(z.instanceof(File).optional())),
      ),
      gambarFormasiAsli: zfd.file(z.instanceof(File)),
      gambarTransisiMenyerang: zfd.file(z.instanceof(File)),
      gambarTransisiBertahan: zfd.file(z.instanceof(File)),
    })
    .safeParseAsync(formData);

  if (!validationResult.success) {
    const errorFormatted = validationResult.error.format() as any;

    return {
      error: {
        general: "Terjadi kesalahan saat menyimpan data. Mohon dicek kembali",
        nama: errorFormatted.nama?._errors,
        deskripsi: errorFormatted.deskripsi?._errors,
        posisi: errorFormatted.posisi?._errors,
        karakter: errorFormatted.karakter?._errors,
        posisiMenyerang: errorFormatted.posisiMenyerang?._errors,
        posisiBertahan: errorFormatted.posisiBertahan?._errors,
        gambarPosisiMenyerang: errorFormatted.gambarPosisiMenyerang?._errors,
        gambarPosisiBertahan: errorFormatted.gambarPosisiBertahan?._errors,
        gambarFormasiAsli: errorFormatted.gambarFormasiAsli?._errors,
        gambarTransisiMenyerang:
          errorFormatted.gambarTransisiMenyerang?._errors,
        gambarTransisiBertahan: errorFormatted.gambarTransisiBertahan?._errors,
      },
    };
  }

  const db = createDrizzleConnection();

  try {
    const { URLs: gambarPosisiMenyerangURLs } = await multipleImageUploader(
      validationResult.data.gambarPosisiMenyerang.filter(
        (file): file is File => file !== undefined,
      ),
      "offense_illustration",
    );

    const { URLs: gambarPosisiBertahanURLs } = await multipleImageUploader(
      validationResult.data.gambarPosisiBertahan.filter(
        (file): file is File => file !== undefined,
      ),
      "defense_illustration",
    );

    // Upload gambarFormasiAsli
    const gambarFormasiAsliURL = await singleImageUploader(
      validationResult.data.gambarFormasiAsli,
      "default_formation_image",
    );

    // Upload gambarFormasiBertahan
    const gambarTransisiBertahanURL = await singleImageUploader(
      validationResult.data.gambarTransisiBertahan,
      "defense_transition_image",
    );

    // Upload gambarFormasiMenyerang
    const gambarTransisiMenyerangURL = await singleImageUploader(
      validationResult.data.gambarTransisiMenyerang,
      "offense_transition_image",
    );

    const idFormations = uuidv7();

    await db.transaction(async (tx) => {
      // Insert formation first
      await tx.insert(formations).values({
        id: idFormations,
        name: validationResult.data.nama.split("").join("-"),
        description: validationResult.data.deskripsi,
        defaultFormationImagePath: gambarFormasiAsliURL,
        offenseTransitionImagePath: gambarTransisiMenyerangURL,
        defenseTransitionImagePath: gambarTransisiBertahanURL,
      });

      // Insert formation-position relationships
      for (let i = 0; i < validationResult.data.posisi.length; i++) {
        await tx.insert(formationPositioning).values({
          id: uuidv7(),
          formationId: idFormations,
          positionId: validationResult.data.posisi[i][0],
          characteristics: validationResult.data.karakter[i],
          offenseDescription: validationResult.data.posisiMenyerang?.[i] ?? [],
          offenseIllustrationPath: gambarPosisiMenyerangURLs[i]?.fullPath,
          defenseDescription: validationResult.data.posisiBertahan?.[i] ?? [],
          defenseIllustrationPath: gambarPosisiBertahanURLs[i]?.fullPath,
          positionNumber: i + 1,
        });
      }
    });
  } catch (error: any) {
    console.error("Error creating ensiklopedi:", error);
    return {
      success: false,
      error: {
        general: error.message || "Terjadi kesalahan saat menyimpan data",
      },
    };
  }

  revalidatePath("/dashboard/admin/ensiklopedi-posisi-pemain");

  return {
    success: true,
    message: "Data berhasil disimpan",
  };
}
