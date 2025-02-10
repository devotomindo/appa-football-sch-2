"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { packages } from "@/db/drizzle/schema";
import { v7 as uuidv7 } from "uuid";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function createPaket(prevState: any, formData: FormData) {
  const db = createDrizzleConnection();

  // VALIDATION
  const validationRules = zfd.formData({
    name: zfd.text(z.string().min(1, "Nama paket wajib diisi")),
    description: zfd.text(z.string().min(1, "Deskripsi wajib diisi")),
    price: zfd.numeric(z.number().min(0, "Harga tidak boleh kurang dari 0")),
    monthDuration: zfd.numeric(
      z.number().int().min(1, "Durasi minimal 1 bulan"),
    ),
    quotaAddition: zfd.numeric(z.number().int().min(1, "Kuota minimal 1")),
  });

  const validationResult = await validationRules.safeParseAsync(formData);

  if (!validationResult.success) {
    const errorFormatted = validationResult.error.format() as any;

    return {
      error: {
        general: undefined,
        name: errorFormatted.name?._errors,
        description: errorFormatted.description?._errors,
        price: errorFormatted.price?._errors,
        monthDuration: errorFormatted.monthDuration?._errors,
        quotaAddition: errorFormatted.quotaAddition?._errors,
      },
    };
  }

  try {
    await db.transaction(async (tx) => {
      await tx.insert(packages).values({
        id: uuidv7(),
        name: validationResult.data.name,
        description: validationResult.data.description,
        price: validationResult.data.price, // Convert to string for numeric type
        monthDuration: validationResult.data.monthDuration,
        quotaAddition: validationResult.data.quotaAddition,
      });
    });
  } catch (error) {
    console.log(error);
    return {
      error: {
        general: "Gagal membuat paket",
      },
    };
  }

  return {
    success: true,
    message: "Berhasil membuat paket",
  };
}
