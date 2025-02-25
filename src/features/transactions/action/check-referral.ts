"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { referrals } from "@/db/drizzle/schema";
import { and, eq } from "drizzle-orm";
// import { transactions } from "@/db/drizzle/schema";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function checkReferral(prevState: any, formData: FormData) {
  // Validation
  const validationResult = await zfd
    .formData({
      referralCode: zfd.text(z.string()),
    })
    .safeParseAsync(formData);

  // Validation error
  if (!validationResult.success) {
    const errorFormatted = validationResult.error.format() as any;

    return {
      error: {
        general: errorFormatted.referralCode?._errors,
      },
    };
  }

  try {
    const db = createDrizzleConnection();
    let result: any;

    await db.transaction(async (tx) => {
      const { referralCode } = validationResult.data;

      // Check for voucher validity
      const referral = await tx
        .select({
          discount: referrals.discount,
        })
        .from(referrals)
        .where(
          and(eq(referrals.code, referralCode), eq(referrals.isActive, true)),
        )
        .limit(1);

      // If referral code wasn't found or already disabled
      if (referral.length === 0) {
        result = {
          error: {
            general: "Kode referral tidak valid",
          },
        };

        return;
      }

      // On success
      result = {
        message:
          "Kode referral berhasil ditemukan. Diskon akan berlaku setelah konfirmasi pesanan",
        discount: referral[0].discount,
      };
    });
    return result;
  } catch (error) {
    console.error("Error creating transaction", error);
    return {
      error: {
        general: "Terjadi kesalahan saat mengecek kode referral",
      },
    };
  }
}
