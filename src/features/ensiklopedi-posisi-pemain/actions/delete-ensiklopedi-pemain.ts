"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { formationPositioning, formations } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function DeleteEnsiklopediPemain(
  prevState: any,
  formData: FormData,
) {
  const validationResult = await zfd
    .formData({
      ensiklopediId: zfd.text(z.string().min(1)),
    })
    .safeParseAsync(formData);

  if (!validationResult.success) {
    const errorFormatted = validationResult.error.format() as any;

    return {
      error: {
        general: undefined,
        ensiklopediId: errorFormatted.assessmentId,
      },
    };
  }

  const db = createDrizzleConnection();

  try {
    await db.transaction(async (tx) => {
      // Delete proPlayerAssessments first
      await tx
        .delete(formationPositioning)
        .where(
          eq(
            formationPositioning.formationId,
            validationResult.data.ensiklopediId,
          ),
        );

      // Then delete the pro player
      await tx
        .delete(formations)
        .where(eq(formations.id, validationResult.data.ensiklopediId));
    });
  } catch (error: any) {
    return {
      error: {
        success: false,
        general: error.message,
      },
    };
  }

  revalidatePath("/dashboard/admin/ensiklopedi-posisi-pemain");

  return {
    success: true,
    message: "Berhasil menghapus ensiklopedi pemain",
  };
}
