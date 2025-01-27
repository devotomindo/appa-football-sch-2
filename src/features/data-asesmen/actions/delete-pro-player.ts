"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { proPlayerAssessments, proPlayers } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function DeleteProPlayer(prevState: any, formData: FormData) {
  const validationResult = await zfd
    .formData({
      proPlayerId: zfd.text(z.string().min(1)),
    })
    .safeParseAsync(formData);

  if (!validationResult.success) {
    const errorFormatted = validationResult.error.format() as any;

    return {
      error: {
        general: undefined,
        proPlayerId: errorFormatted.assessmentId,
      },
    };
  }

  const db = createDrizzleConnection();

  try {
    await db.transaction(async (tx) => {
      // Delete proPlayerAssessments first
      await tx
        .delete(proPlayerAssessments)
        .where(
          eq(
            proPlayerAssessments.proPlayerId,
            validationResult.data.proPlayerId,
          ),
        );

      // Then delete the pro player
      await tx
        .delete(proPlayers)
        .where(eq(proPlayers.id, validationResult.data.proPlayerId));
    });
  } catch (error: any) {
    return {
      error: {
        success: false,
        general: error.message,
      },
    };
  }

  revalidatePath("/dashboard/admin/data-asesmen");

  return {
    success: true,
    message: "Berhasil menghapus pemain pro",
  };
}
