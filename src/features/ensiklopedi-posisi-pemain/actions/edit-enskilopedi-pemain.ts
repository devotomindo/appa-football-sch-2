"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { formationPositioning, formations } from "@/db/drizzle/schema";
import { createServerClient } from "@/db/supabase/server";
import {
  multipleImageUploader,
  singleImageUploader,
} from "@/lib/utils/image-uploader";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { z } from "zod";
import { zfd } from "zod-form-data";

const validatePortraitImage = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const metadata = await sharp(buffer).metadata();
  return Boolean(
    metadata.height && metadata.width && metadata.height > metadata.width,
  );
};

const imageValidation = z
  .instanceof(File)
  .refine((val) => val.size < 1024 * 1024 * 5, {
    message: "File foto maksimal 5MB",
  })
  .refine((val) => val.type.includes("image"), {
    message: "File foto harus berupa gambar",
  });

const positionImageValidation = z
  .instanceof(File)
  .refine((val) => val.size < 1024 * 1024 * 5, {
    message: "File foto maksimal 5MB",
  })
  .refine((val) => val.type.includes("image"), {
    message: "File foto harus berupa gambar",
  })
  .optional();

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
        z.array(zfd.file(positionImageValidation)),
      ),
      gambarPosisiBertahan: zfd.repeatable(
        z.array(zfd.file(positionImageValidation)),
      ),
      gambarFormasiAsli: zfd.file(
        imageValidation
          .refine(
            async (file) => await validatePortraitImage(file),
            "Gambar formasi asli harus berorientiasi portrait (tinggi > lebar)",
          )
          .optional(),
      ),
      gambarTransisiMenyerang: zfd.file(
        imageValidation
          .refine(
            async (file) => await validatePortraitImage(file),
            "Gambar transisi menyerang harus berorientiasi portrait (tinggi > lebar)",
          )
          .optional(),
      ),
      gambarTransisiBertahan: zfd.file(
        imageValidation
          .refine(
            async (file) => await validatePortraitImage(file),
            "Gambar transisi bertahan harus berorientiasi portrait (tinggi > lebar)",
          )
          .optional(),
      ),
      idPosisiFormasi: zfd.repeatable(
        z.array(zfd.repeatable(z.array(z.string()))),
      ),
      deletedPosisiMenyerangImage: zfd.repeatable(
        z.array(zfd.text(z.string().optional())),
      ),
      deletedPosisiBertahanImage: zfd.repeatable(
        z.array(zfd.text(z.string().optional())),
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
        posisi: validationResult.error.errors
          .filter((err) => err.path[0] === "posisi")
          .reduce((acc: string[], err) => {
            const index = err.path[1] as number;
            if (!acc[index])
              acc[index] =
                `Posisi #${index + 1} tidak boleh kosong. Harap pilih 1`;
            return acc;
          }, []),
        karakter: validationResult.error.errors
          .filter((err) => err.path[0] === "karakter")
          .reduce((acc: string[], err) => {
            const index = err.path[1] as number;
            if (!acc[index])
              acc[index] =
                `Karakter tidak boleh kosong pada Posisi #${index + 1}`;
            return acc;
          }, []),
        posisiMenyerang: errorFormatted.posisiMenyerang?._errors,
        posisiBertahan: errorFormatted.posisiBertahan?._errors,
        gambarPosisiMenyerang: validationResult.error.errors
          .filter((err) => err.path[0] === "gambarPosisiMenyerang")
          .reduce((acc: string[], err) => {
            const index = err.path[1] as number;
            if (!acc[index]) acc[index] = err.message;
            return acc;
          }, []),
        gambarPosisiBertahan: validationResult.error.errors
          .filter((err) => err.path[0] === "gambarPosisiBertahan")
          .reduce((acc: string[], err) => {
            const index = err.path[1] as number;
            if (!acc[index]) acc[index] = err.message;
            return acc;
          }, []),
        gambarFormasiAsli: errorFormatted.gambarFormasiAsli?._errors,
        gambarTransisiMenyerang:
          errorFormatted.gambarTransisiMenyerang?._errors,
        gambarTransisiBertahan: errorFormatted.gambarTransisiBertahan?._errors,
        idFormasi: errorFormatted.idFormasi?._errors,
        idPosisiFormasi: errorFormatted.idPosisiFormasi?._errors,
      },
    };
  }

  try {
    const db = createDrizzleConnection();
    const supabase = await createServerClient();

    // Get existing positions ordered by position number
    const existingPositions = await db
      .select({
        id: formationPositioning.id,
        offenseIllustrationPath: formationPositioning.offenseIllustrationPath,
        defenseIllustrationPath: formationPositioning.defenseIllustrationPath,
        positionNumber: formationPositioning.positionNumber,
      })
      .from(formationPositioning)
      .where(
        eq(formationPositioning.formationId, validationResult.data.idFormasi),
      )
      .orderBy(formationPositioning.positionNumber);

    // Delete images marked for deletion
    for (
      let i = 0;
      i < validationResult.data.deletedPosisiMenyerangImage.length;
      i++
    ) {
      if (validationResult.data.deletedPosisiMenyerangImage[i] === "true") {
        const position = existingPositions.find(
          (p) => p.positionNumber === i + 1,
        );
        if (position?.offenseIllustrationPath) {
          const [folder, filename] =
            position.offenseIllustrationPath.split("/");
          await supabase.storage.from(folder).remove([filename]);
        }
      }
    }

    for (
      let i = 0;
      i < validationResult.data.deletedPosisiBertahanImage.length;
      i++
    ) {
      if (validationResult.data.deletedPosisiBertahanImage[i] === "true") {
        const position = existingPositions.find(
          (p) => p.positionNumber === i + 1,
        );
        if (position?.defenseIllustrationPath) {
          const [folder, filename] =
            position.defenseIllustrationPath.split("/");
          await supabase.storage.from(folder).remove([filename]);
        }
      }
    }

    // Create arrays to store image URLs for each position
    const offenseImageURLs: (string | null)[] = new Array(
      existingPositions.length,
    ).fill(null);
    const defenseImageURLs: (string | null)[] = new Array(
      existingPositions.length,
    ).fill(null);

    // Process offense images
    if (validationResult.data.gambarPosisiMenyerang) {
      for (
        let i = 0;
        i < validationResult.data.gambarPosisiMenyerang.length;
        i++
      ) {
        const file = validationResult.data.gambarPosisiMenyerang[i];
        if (file instanceof File) {
          const existingFileName =
            existingPositions[i]?.offenseIllustrationPath?.split("/")[1] ||
            undefined;
          const { URLs } = await multipleImageUploader(
            [file],
            "offense_illustration",
            existingFileName ? [existingFileName] : undefined,
          );
          offenseImageURLs[i] = URLs[0]?.fullPath || null;
        }
      }
    }

    // Process defense images
    if (validationResult.data.gambarPosisiBertahan) {
      for (
        let i = 0;
        i < validationResult.data.gambarPosisiBertahan.length;
        i++
      ) {
        const file = validationResult.data.gambarPosisiBertahan[i];
        if (file instanceof File) {
          const existingFileName =
            existingPositions[i]?.defenseIllustrationPath?.split("/")[1] ||
            undefined;
          const { URLs } = await multipleImageUploader(
            [file],
            "defense_illustration",
            existingFileName ? [existingFileName] : undefined,
          );
          defenseImageURLs[i] = URLs[0]?.fullPath || null;
        }
      }
    }

    // Process mandatory images (formasi asli, transisi, etc.)
    const newMandatoryImageId = await db
      .select({
        defaultFormation: formations.defaultFormationImagePath,
        offenseTransition: formations.offenseTransitionImagePath,
        defenseTransition: formations.defenseTransitionImagePath,
      })
      .from(formations)
      .where(eq(formations.id, validationResult.data.idFormasi))
      .then((res) => ({
        defaultFormation: res[0].defaultFormation?.split("/")[1],
        offenseTransition: res[0].offenseTransition?.split("/")[1],
        defenseTransition: res[0].defenseTransition?.split("/")[1],
      }));

    try {
      // Upload gambarFormasiAsli
      let gambarFormasiAsliURL: string | undefined;
      if (
        validationResult.data.gambarFormasiAsli instanceof File &&
        newMandatoryImageId.defaultFormation
      ) {
        gambarFormasiAsliURL = await singleImageUploader(
          validationResult.data.gambarFormasiAsli,
          "default_formation_image",
          newMandatoryImageId.defaultFormation,
        );
      }

      // Upload gambarFormasiBertahan
      let gambarTransisiBertahanURL: string | undefined;
      if (
        validationResult.data.gambarTransisiBertahan instanceof File &&
        newMandatoryImageId.defenseTransition
      ) {
        gambarTransisiBertahanURL = await singleImageUploader(
          validationResult.data.gambarTransisiBertahan,
          "defense_transition_image",
          newMandatoryImageId.defenseTransition,
        );
      }

      // Upload gambarFormasiMenyerang
      let gambarTransisiMenyerangURL: string | undefined;
      if (
        validationResult.data.gambarTransisiMenyerang instanceof File &&
        newMandatoryImageId.offenseTransition
      ) {
        gambarTransisiMenyerangURL = await singleImageUploader(
          validationResult.data.gambarTransisiMenyerang,
          "offense_transition_image",
          newMandatoryImageId.offenseTransition,
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
            updatedAt: new Date(),
          })
          .where(eq(formations.id, validationResult.data.idFormasi));

        // Update formation-position relationships by maintaining position order
        for (let i = 0; i < validationResult.data.posisi.length; i++) {
          const position = existingPositions.find(
            (p) => p.positionNumber === i + 1,
          );
          if (!position) continue;

          const wasOffenseDeleted =
            validationResult.data.deletedPosisiMenyerangImage[i] === "true";
          const wasDefenseDeleted =
            validationResult.data.deletedPosisiBertahanImage[i] === "true";

          await tx
            .update(formationPositioning)
            .set({
              characteristics: validationResult.data.karakter[i],
              offenseDescription:
                validationResult.data.posisiMenyerang?.[i] ?? [],
              offenseIllustrationPath: wasOffenseDeleted
                ? null
                : (offenseImageURLs[i] ?? position.offenseIllustrationPath),
              defenseDescription:
                validationResult.data.posisiBertahan?.[i] ?? [],
              defenseIllustrationPath: wasDefenseDeleted
                ? null
                : (defenseImageURLs[i] ?? position.defenseIllustrationPath),
              positionId: validationResult.data.posisi[i][0],
              updatedAt: new Date(),
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
      `/dashboard/admin/ensiklopedi-posisi-pemain/detail-ensiklopedi-posisi-pemain/${validationResult.data.idFormasi}`,
    );
    revalidatePath("/dashboard/ensiklopedi-posisi-pemain");
    revalidatePath(
      `/dashboard/ensiklopedi-posisi-pemain/${validationResult.data.idFormasi}`,
    );

    return {
      success: true,
      message: "Data berhasil disimpan",
    };
  } catch (error: any) {
    console.error("Error updating ensiklopedi:", error);
    return {
      success: false,
      error: {
        general: error.message || "Terjadi kesalahan saat menyimpan data",
      },
    };
  }
}
