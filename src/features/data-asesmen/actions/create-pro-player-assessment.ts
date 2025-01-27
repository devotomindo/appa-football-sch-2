"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { proPlayerAssessments } from "@/db/drizzle/schema";
import { revalidatePath } from "next/cache";
import { v7 as uuidv7 } from "uuid";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function createProPlayerAssessment(
  prevState: any,
  formData: FormData,
) {
  const validationResult = await zfd
    .formData({
      proPlayerId: zfd.text(z.string().min(1)),
      nama: zfd.text(z.string().min(1)),
      skor: zfd.numeric(z.number().min(1)),
    })
    .safeParseAsync(formData);

  if (!validationResult.success) {
    const errorFormatted = validationResult.error.format() as any;

    return {
      error: {
        general: undefined,
        nama: errorFormatted.nama?._errors,
        skor: errorFormatted.skor?._errors,
      },
    };
  }

  const db = createDrizzleConnection();

  try {
    await db.transaction(async (tx) => {
      await tx.insert(proPlayerAssessments).values({
        id: uuidv7(),
        proPlayerId: validationResult.data.proPlayerId,
        assessmentId: validationResult.data.nama,
        score: String(validationResult.data.skor),
      });
    });
  } catch (error: any) {
    return {
      error: {
        success: false,
        general: error.message,
      },
    };
  }

  revalidatePath(
    `/dashboard/admin/data-asesmen/detail-pemain-pro/${validationResult.data.proPlayerId}`,
  );

  return {
    success: true,
    message: "Berhasil menambahkan data asesmen pemain pro",
  };
}
