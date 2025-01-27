"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { proPlayerAssessments } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function editProPlayerAssessment(
  prevState: any,
  formData: FormData,
) {
  const validationResult = await zfd
    .formData({
      assessmentId: zfd.text(z.string().min(1)),
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
      if (validationResult.data.nama !== validationResult.data.assessmentId) {
        await tx
          .update(proPlayerAssessments)
          .set({
            assessmentId: validationResult.data.nama,
            score: String(validationResult.data.skor),
          })
          .where(
            eq(proPlayerAssessments.id, validationResult.data.assessmentId),
          );
      } else {
        await tx
          .update(proPlayerAssessments)
          .set({
            score: String(validationResult.data.skor),
          })
          .where(
            eq(proPlayerAssessments.id, validationResult.data.assessmentId),
          );
      }
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
    message: "Berhasil mengedit data asesmen pemain pro",
  };
}
