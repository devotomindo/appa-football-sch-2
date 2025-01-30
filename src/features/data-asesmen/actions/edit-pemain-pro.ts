"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { proPlayers } from "@/db/drizzle/schema";
import { singleImageUploaderAndGetURL } from "@/features/ensiklopedi-posisi-pemain/utils/image-uploader";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function editPemainPro(prevState: any, formData: FormData) {
  const validationResult = await zfd
    .formData({
      id: zfd.text(z.string().min(1)),
      foto: zfd.file(
        z
          .instanceof(File)
          .refine((val) => val.size < 1024 * 1024 * 5, {
            message: "File foto maksimal 5MB",
          })
          .refine((val) => val.type.includes("image"), {
            message: "File foto harus berupa gambar",
          })
          .optional(),
      ),
      nama: zfd.text(z.string().min(1, "Nama pemain harus diisi")),
      umur: zfd.numeric(z.number().min(1, "Umur harus diisi")),
      berat: zfd.numeric(z.number().min(1, "Berat badan harus diisi")),
      tinggi: zfd.numeric(z.number().min(1, "Tinggi badan harus diisi")),
      tim: zfd.text(z.string().min(1, "Tim harus diisi")),
      positionId: zfd.text(z.string().min(1, "Posisi harus dipilih")),
      countryId: zfd.text(z.string().min(1, "Negara harus dipilih")),
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

  const db = createDrizzleConnection();

  try {
    await db.transaction(async (tx) => {
      let fullPath: string | undefined = undefined;
      if (validationResult.data.foto) {
        fullPath = await singleImageUploaderAndGetURL(
          validationResult.data.foto,
          "pro_players",
        );
      }

      await tx
        .update(proPlayers)
        .set({
          playersName: validationResult.data.nama,
          age: validationResult.data.umur,
          photoPath: fullPath,
          positionId: validationResult.data.positionId,
          currentTeam: validationResult.data.tim,
          countryId: Number(validationResult.data.countryId),
          weight: validationResult.data.berat,
          height: validationResult.data.tinggi,
        })
        .where(eq(proPlayers.id, validationResult.data.id));
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
    message: "Berhasil mengedit data pemain pro",
  };
}
