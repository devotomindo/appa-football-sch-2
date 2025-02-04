"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { assessmentSessions } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function completeAssessmentSession(
  prevState: any,
  formData: FormData,
) {
  const validationResult = await zfd
    .formData({
      sessionId: zfd.text(z.string().uuid()),
    })
    .safeParseAsync(formData);

  if (!validationResult.success) {
    return {
      error: {
        general: "Invalid session ID",
      },
    };
  }

  try {
    const db = createDrizzleConnection();

    await db.transaction(async (tx) => {
      await tx
        .update(assessmentSessions)
        .set({
          completedAt: new Date(),
        })
        .where(eq(assessmentSessions.id, validationResult.data.sessionId));
    });

    return {
      message: "Sesi berhasil diselesaikan",
    };
  } catch (error) {
    console.error("Error: ", error);
    return {
      error: {
        general: "Gagal menyelesaikan sesi",
      },
    };
  }
}
