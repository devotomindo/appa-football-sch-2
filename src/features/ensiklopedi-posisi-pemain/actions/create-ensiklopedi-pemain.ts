"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { formationPositioning, formations } from "@/db/drizzle/schema";
import {
  multipleImageUploader,
  singleImageUploader,
} from "@/lib/utils/image-uploader";
import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { v7 as uuidv7 } from "uuid";
import { z } from "zod";
import { zfd } from "zod-form-data";

// Helper function to validate portrait image using Sharp
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
    message: "Ukuran file tidak boleh lebih dari 5MB",
    path: ["size"], // Add path for better error handling
  })
  .refine((val) => val.type.includes("image"), {
    message: "File harus berupa gambar",
    path: ["type"], // Add path for better error handling
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
        z.array(zfd.file(positionImageValidation)),
      ),
      gambarPosisiBertahan: zfd.repeatable(
        z.array(zfd.file(positionImageValidation)),
      ),
      gambarFormasiAsli: zfd.file(
        z
          .instanceof(File)
          .refine((val) => val.type.includes("image"), {
            message: "File harus berupa gambar",
            path: ["type"], // Add path for better error handling
          })
          .refine((val) => val.size < 1024 * 1024 * 5, {
            message: "Ukuran file tidak boleh lebih dari 5MB",
            path: ["size"], // Add path for better error handling
          })
          .refine(
            async (file) => await validatePortraitImage(file),
            "Gambar formasi asli harus berorientiasi portrait (tinggi > lebar)",
          ),
      ),
      gambarTransisiMenyerang: zfd.file(
        imageValidation
          .refine((val) => val.size < 1024 * 1024 * 5, {
            message: "Ukuran file tidak boleh lebih dari 5MB",
          })
          .refine(
            async (file) => await validatePortraitImage(file),
            "Gambar transisi menyerang harus berorientiasi portrait (tinggi > lebar)",
          ),
      ),
      gambarTransisiBertahan: zfd.file(
        imageValidation
          .refine((val) => val.size < 1024 * 1024 * 5, {
            message: "Ukuran file tidak boleh lebih dari 5MB",
          })
          .refine(
            async (file) => await validatePortraitImage(file),
            "Gambar transisi bertahan harus berorientiasi portrait (tinggi > lebar)",
          ),
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
        gambarFormasiAsli: errorFormatted.gambarFormasiAsli?._errors[0],
        gambarTransisiMenyerang:
          errorFormatted.gambarTransisiMenyerang?._errors?.[0],
        gambarTransisiBertahan:
          errorFormatted.gambarTransisiBertahan?._errors?.[0],
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
        name: validationResult.data.nama,
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
