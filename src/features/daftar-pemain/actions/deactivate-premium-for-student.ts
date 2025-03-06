"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { studentPremiumAssignments } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function deactivatePremium(prevState: any, formData: FormData) {
  // Changed validation to accept the premium assignment ID directly
  const validationResult = await zfd
    .formData({
      premiumId: zfd.text(z.string().uuid()),
    })
    .safeParseAsync(formData);

  if (!validationResult.success) {
    const errorFormatted = validationResult.error.format() as any;
    return {
      error: {
        general: errorFormatted._errors || errorFormatted.premiumId?._errors,
      },
    };
  }

  try {
    const db = createDrizzleConnection();
    const premiumAssignmentId = validationResult.data.premiumId;

    // Deactivate the premium assignment by setting deactivatedAt to current date
    await db
      .update(studentPremiumAssignments)
      .set({
        deactivatedAt: new Date(),
      })
      .where(eq(studentPremiumAssignments.id, premiumAssignmentId));

    // Invalidate the cache
    revalidatePath("/dashboard/daftar-pemain");

    return {
      message: "Berhasil menonaktifkan status premium untuk siswa",
    };
  } catch (error) {
    console.error("Error deactivating premium:", error);
    return {
      error: {
        general: "Gagal menonaktifkan status premium. Silakan coba lagi nanti.",
      },
    };
  }
}
