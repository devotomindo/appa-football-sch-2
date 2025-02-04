"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { formationPositioning, formations } from "@/db/drizzle/schema";
import {
  multipleImageUploader,
  singleImageUploader,
} from "@/lib/utils/image-uploader";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { zfd } from "zod-form-data";

interface ImageUploadResult {
  fullPath: string;
}

export async function editEnskilopediPemain(
  prevState: any,
  formData: FormData,
) {
  const validationResult = await zfd
    .formData({
      idFormasi: zfd.text(z.string()),
      nama: zfd.text(z.string().min(3, "Nama formasi minimal 3 karakter")),
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
      gambarFormasiAsli: zfd.file(z.instanceof(File).optional()),
      gambarTransisiMenyerang: zfd.file(z.instanceof(File).optional()),
      gambarTransisiBertahan: zfd.file(z.instanceof(File).optional()),
      idPosisiFormasi: zfd.repeatable(
        z.array(zfd.repeatable(z.array(z.string()))),
      ),
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
        idFormasi: errorFormatted.idFormasi?._errors,
        idPosisiFormasi: errorFormatted.idPosisiFormasi?._errors,
      },
    };
  }

  const db = createDrizzleConnection();

  try {
    let gambarPosisiMenyerangURLs: ImageUploadResult[] = [];
    if (validationResult.data.gambarPosisiMenyerang) {
      const { URLs } = await multipleImageUploader(
        validationResult.data.gambarPosisiMenyerang.filter(
          (file): file is File => file !== undefined,
        ),
        "offense_illustration",
      );
      gambarPosisiMenyerangURLs = URLs;
    }

    let gambarPosisiBertahanURLs: ImageUploadResult[] = [];
    if (validationResult.data.gambarPosisiBertahan) {
      const { URLs } = await multipleImageUploader(
        validationResult.data.gambarPosisiBertahan.filter(
          (file): file is File => file !== undefined,
        ),
        "defense_illustration",
      );
      gambarPosisiBertahanURLs = URLs;
    }

    // Upload gambarFormasiAsli
    let gambarFormasiAsliURL: string | undefined;
    if (validationResult.data.gambarFormasiAsli) {
      gambarFormasiAsliURL = await singleImageUploader(
        validationResult.data.gambarFormasiAsli,
        "default_formation_image",
      );
    }

    // Upload gambarFormasiBertahan
    let gambarTransisiBertahanURL: string | undefined;
    if (validationResult.data.gambarTransisiBertahan) {
      gambarTransisiBertahanURL = await singleImageUploader(
        validationResult.data.gambarTransisiBertahan,
        "defense_transition_image",
      );
    }

    // Upload gambarFormasiMenyerang
    let gambarTransisiMenyerangURL: string | undefined;
    if (validationResult.data.gambarTransisiMenyerang) {
      gambarTransisiMenyerangURL = await singleImageUploader(
        validationResult.data.gambarTransisiMenyerang,
        "offense_transition_image",
      );
    }

    await db.transaction(async (tx) => {
      await tx
        .update(formations)
        .set({
          name: validationResult.data.nama,
          description: validationResult.data.deskripsi,
          defaultFormationImagePath: gambarFormasiAsliURL,
          offenseTransitionImagePath: gambarTransisiMenyerangURL,
          defenseTransitionImagePath: gambarTransisiBertahanURL,
        })
        .where(eq(formations.id, validationResult.data.idFormasi));

      // Insert formation-position relationships
      for (let i = 0; i < validationResult.data.posisi.length; i++) {
        await tx
          .update(formationPositioning)
          .set({
            characteristics: validationResult.data.karakter[i],
            offenseDescription:
              validationResult.data.posisiMenyerang?.[i] ?? [],
            offenseIllustrationPath:
              gambarPosisiMenyerangURLs[i]?.fullPath ?? null,
            defenseDescription: validationResult.data.posisiBertahan?.[i] ?? [],
            defenseIllustrationPath:
              gambarPosisiBertahanURLs[i]?.fullPath ?? null,
          })
          .where(
            eq(
              formationPositioning.id,
              validationResult.data.idPosisiFormasi[i][0],
            ),
          );
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
  revalidatePath(
    `/dashboard/admin/ensiklopedi-posisi-pemain/${validationResult.data.idFormasi}`,
  );

  return {
    success: true,
    message: "Data berhasil disimpan",
  };
}
