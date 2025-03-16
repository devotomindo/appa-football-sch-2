"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { referrals, referralsPackagesAssignments } from "@/db/drizzle/schema";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function checkReferral(prevState: any, formData: FormData) {
  // Validation
  const validationResult = await zfd
    .formData({
      referralCode: zfd.text(z.string()),
      packageId: zfd.text(z.string()),
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
      const { referralCode, packageId } = validationResult.data;

      // First get the referral
      const referralResult = await tx
        .select({
          id: referrals.id,
          discount: referrals.discount,
        })
        .from(referrals)
        .where(
          and(eq(referrals.code, referralCode), eq(referrals.isActive, true)),
        )
        .limit(1);

      // If referral code wasn't found or already disabled
      if (referralResult.length === 0) {
        result = {
          error: {
            general: "Kode referral tidak valid",
          },
        };
        return;
      }

      // Check if package is assigned to this referral
      const assignmentExists = await tx
        .select({
          exists: sql<boolean>`EXISTS (
            SELECT 1 FROM ${referralsPackagesAssignments}
            WHERE ${referralsPackagesAssignments.referralId} = ${referralResult[0].id}
            AND ${referralsPackagesAssignments.packageId} = ${packageId}
          )`,
        })
        .from(referralsPackagesAssignments)
        .limit(1);

      // Check if referral can be used for this package
      if (!assignmentExists[0]?.exists) {
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
        discount: referralResult[0].discount,
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
