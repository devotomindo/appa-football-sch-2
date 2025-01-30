"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { proPlayers } from "@/db/drizzle/schema";
import { singleImageUploader } from "@/lib/utils/image-uploader";
import { revalidatePath } from "next/cache";
import { v7 as uuidv7 } from "uuid";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function createPemainPro(prevState: any, formData: FormData) {
  const db = createDrizzleConnection();

  const validationResult = await zfd
    .formData({
      nama: zfd.text(z.string().min(1)),
      umur: zfd.numeric(z.number().min(1)),
      tim: zfd.text(z.string().min(1)),
      positionId: zfd.text(z.string()),
      foto: zfd.file(
        z
          .instanceof(File)
          .refine((val) => val.size < 1024 * 1024 * 5, {
            message: "File foto maksimal 5MB",
          })
          .refine((val) => val.type.includes("image"), {
            message: "File foto harus berupa gambar",
          }),
      ),
      countryId: zfd.text(z.string()),
      berat: zfd.numeric(z.number().min(1)),
      tinggi: zfd.numeric(z.number().min(1)),
    })
    .safeParseAsync(formData);

  if (!validationResult.success) {
    const errorFormatted = validationResult.error.format() as any;

    return {
      error: {
        general: undefined,
        nama: errorFormatted.nama?._errors,
        umur: errorFormatted.umur?._errors,
        tim: errorFormatted.tim?._errors,
        positionId: errorFormatted.positionId?._errors,
        foto: errorFormatted.foto?._errors,
        countryId: errorFormatted.countryId?._errors,
        berat: errorFormatted.berat?._errors,
        tinggi: errorFormatted.tinggi?._errors,
      },
    };
  }

  try {
    await db.transaction(async (tx) => {
      const fullPath = await singleImageUploader(
        validationResult.data.foto,
        "pro_players",
      );

      await tx.insert(proPlayers).values({
        id: uuidv7(),
        playersName: validationResult.data.nama,
        age: validationResult.data.umur,
        photoPath: fullPath,
        positionId: validationResult.data.positionId,
        currentTeam: validationResult.data.tim,
        countryId: Number(validationResult.data.countryId),
        weight: validationResult.data.berat,
        height: validationResult.data.tinggi,
      });
    });
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/dashboard/admin/data-asesmen");

  return {
    success: true,
    message: "Data berhasil disimpan",
  };
}
