"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { referrals } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zfd } from "zod-form-data";

const validationSchema = zfd.formData({
  id: zfd.text(z.string().uuid()),
});

export async function disableReferral(prevState: any, formData: FormData) {
  const db = createDrizzleConnection();

  const validationResult = await validationSchema.safeParseAsync(formData);

  if (!validationResult.success) {
    return {
      error: {
        general: "Invalid referral ID",
      },
    };
  }

  try {
    await db
      .update(referrals)
      .set({
        isActive: false,
      })
      .where(eq(referrals.id, validationResult.data.id));

    return { message: "Referral berhasil dinonaktifkan" };
  } catch (error) {
    return {
      error: {
        general: "Failed to disable referral code",
      },
    };
  }
}
