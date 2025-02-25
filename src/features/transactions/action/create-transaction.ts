"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { createMidtransClient } from "@/lib/utils/midtrans";
// import { transactions } from "@/db/drizzle/schema";
import { referrals, transactions } from "@/db/drizzle/schema";
import { getPackageById } from "@/features/daftar-paket/actions/get-package-by-id";
import { getUserById } from "@/features/user/actions/get-user-by-id";
import { eq } from "drizzle-orm";
import { v7 as uuidv7 } from "uuid";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function createTransaction(prevState: any, formData: FormData) {
  // Validation
  const validationResult = await zfd
    .formData({
      userId: zfd.text(z.string().uuid()),
      schoolId: zfd.text(z.string().uuid()),
      packageId: zfd.text(z.string().uuid()),
      referralCode: zfd.text(z.string()).optional(),
      finalPrice: zfd.numeric(z.number()),
    })
    .safeParseAsync(formData);

  // Validation error
  if (!validationResult.success) {
    const errorFormatted = validationResult.error.format() as any;

    return {
      error: {
        general:
          errorFormatted.userId?._errors ||
          errorFormatted.schoolId?._errors ||
          errorFormatted.packageId?._errors ||
          errorFormatted.voucherCode?._errors ||
          errorFormatted.finalPrice?._errors,
      },
    };
  }

  try {
    const db = createDrizzleConnection();
    let result: any;

    await db.transaction(async (tx) => {
      const { userId, schoolId, packageId, referralCode, finalPrice } =
        validationResult.data;

      const currentTime = new Date();

      // Generate orderId at the top level and use consistently
      const orderId = uuidv7();

      // Create midtrans client
      const midtransClient = createMidtransClient();

      // Get User Info
      const userData = await getUserById(userId);
      // Split the name into array of words
      const nameArray = userData?.name?.split(" ");
      // First name will be all words except the last one
      const firstName = nameArray?.slice(0, -1).join(" ") || "Unknown";
      // Last name will be just the last word
      const lastName = nameArray ? nameArray[nameArray.length - 1] : "Unknown";

      // Get Package Info
      const packageData = await getPackageById(packageId);

      const parameter = {
        transaction_details: {
          order_id: orderId, // Use the same orderId
          gross_amount: finalPrice,
        },
        customer_details: {
          first_name: firstName,
          last_name: lastName,
          email: userData.email,
        },
        item_details: [
          {
            id: packageId,
            price: finalPrice,
            quantity: 1,
            name: packageData.name,
          },
        ],
        custom_expiry: {
          order_time: currentTime.toISOString(),
          expiry_duration: 60,
          unit: "minute",
        },
        school_id: schoolId,
        referral_code: referralCode ?? "-",
      };

      // Create Midtrans SNAP transaction
      const midtransResponse =
        await midtransClient.createTransaction(parameter);

      if (!midtransResponse.token) {
        result = {
          error: {
            general: "Terjadi kesalahan saat membuat transaksi",
          },
        };
        return;
      }

      // Process referral if exists
      let referralId: string | null = null;
      if (referralCode) {
        const referralData = await tx
          .select({
            id: referrals.id,
          })
          .from(referrals)
          .where(eq(referrals.code, referralCode))
          .limit(1)
          .then((res) => res[0]);

        referralId = referralData?.id;
      }

      // Save transaction with the same orderId
      await tx.insert(transactions).values({
        id: orderId, // Use the same orderId
        userId: userId,
        schoolId: schoolId,
        packageId: packageId,
        status: "initiated",
        midtransToken: midtransResponse.token,
        createdAt: currentTime,
        updatedAt: currentTime,
        referralId: referralId,
        billedAmount: finalPrice,
      });

      result = {
        success: true,
        message: "Transaksi berhasil dibuat",
        data: {
          orderId: orderId, // Return the same orderId
        },
      };
    });

    return result;
  } catch (error) {
    console.error("Error creating transaction:", error);
    return {
      error: {
        general: "Terjadi kesalahan saat membuat transaksi",
      },
    };
  }
}
