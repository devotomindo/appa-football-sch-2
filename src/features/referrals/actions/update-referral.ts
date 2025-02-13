"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { referrals } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zfd } from "zod-form-data";

const validationSchema = zfd.formData({
  id: zfd.text(z.string().uuid()),
  code: zfd.text(z.string().min(3).max(20)),
  referrerId: zfd.text(z.string().uuid()),
  commission: zfd.numeric(z.number().positive()),
  discount: zfd.numeric(z.number().positive()),
});

export async function updateReferral(prevState: any, formData: FormData) {
  const db = createDrizzleConnection();

  const validationResult = await validationSchema.safeParseAsync(formData);

  if (!validationResult.success) {
    const errorFormatted = validationResult.error.format() as any;

    return {
      error: {
        general: undefined,
        code: errorFormatted.code?._errors,
        referrerId: errorFormatted.referrerId?._errors,
        commission: errorFormatted.commission?._errors,
        discount: errorFormatted.discount?._errors,
      },
    };
  }

  try {
    await db.transaction(async (tx) => {
      await tx
        .update(referrals)
        .set({
          code: validationResult.data.code,
          referrerId: validationResult.data.referrerId,
          commission: validationResult.data.commission,
          discount: validationResult.data.discount,
        })
        .where(eq(referrals.id, validationResult.data.id));
    });
    return { message: "Referral updated successfully" };
  } catch (error) {
    console.error(error);
    return {
      error: {
        general: "Failed to update referral code",
      },
    };
  }
}
