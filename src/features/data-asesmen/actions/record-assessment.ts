"use server";
import { createDrizzleConnection } from "@/db/drizzle/connection";
import { assessmentRecords } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function recordAssessment(prevState: any, formData: FormData) {
  const validationResult = await zfd
    .formData({
      recordId: zfd.text(z.string().uuid()),
      score: zfd.numeric(
        z.number().positive({ message: "Nilai harus positif" }),
      ),
    })
    .safeParseAsync(formData);

  if (!validationResult.success) {
    const errorFormatted = validationResult.error.format() as any;
    return {
      error: {
        general: errorFormatted.score?._errors,
      },
    };
  }

  try {
    let result: any;
    const db = createDrizzleConnection();

    await db.transaction(async (tx) => {
      // Update Assessment Record
      await tx
        .update(assessmentRecords)
        .set({
          score: validationResult.data.score,
        })
        .where(eq(assessmentRecords.id, validationResult.data.recordId))
        .execute();

      result = {
        message: "Nilai berhasil disimpan",
      };
    });

    return result;
  } catch (error) {
    console.error("Error: ", error);
    return {
      error: {
        general: "Gagal menyimpan nilai",
      },
    };
  }
}
