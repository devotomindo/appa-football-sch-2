"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { referrals, referralsPackagesAssignments } from "@/db/drizzle/schema";
import { v7 as uuidv7 } from "uuid";
import { z } from "zod";
import { zfd } from "zod-form-data";

const validationSchema = zfd.formData({
  code: zfd.text(z.string().min(3).max(20)),
  referrerId: zfd.text(z.string().uuid()),
  commission: zfd.numeric(z.number().positive()),
  discount: zfd.numeric(z.number().positive()),
  packageIds: zfd.repeatable(
    z.array(zfd.text(z.string().uuid())).min(1, "Pilih minimal satu paket"),
  ),
});

export async function createReferral(prevState: any, formData: FormData) {
  const db = createDrizzleConnection();

  // Validate form data
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
        packageIds: errorFormatted.packageIds?._errors,
      },
    };
  }

  try {
    await db.transaction(async (tx) => {
      const referralId = uuidv7();

      // Insert referral
      await tx.insert(referrals).values({
        id: referralId,
        code: validationResult.data.code,
        referrerId: validationResult.data.referrerId,
        commission: validationResult.data.commission,
        discount: validationResult.data.discount,
        isActive: true,
      });

      // Insert package assignments
      if (validationResult.data.packageIds.length > 0) {
        await tx.insert(referralsPackagesAssignments).values(
          validationResult.data.packageIds.map((packageId) => ({
            id: uuidv7(),
            referralId,
            packageId,
          })),
        );
      }
    });

    return { message: "Referral berhasil dibuat" };
  } catch (error) {
    console.error(error);
    return {
      error: {
        general: "Failed to create referral code",
      },
    };
  }
}
