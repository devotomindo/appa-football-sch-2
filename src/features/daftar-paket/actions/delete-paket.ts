"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { packages } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";
import { zfd } from "zod-form-data";

export async function deletePaket(prevState: any, formData: FormData) {
  const db = createDrizzleConnection();

  // VALIDATION
  const validationRules = zfd.formData({
    id: zfd.text(),
  });

  const validationResult = await validationRules.safeParseAsync(formData);

  if (!validationResult.success) {
    return {
      error: {
        general: "ID paket tidak valid",
      },
    };
  }

  try {
    await db.transaction(async (tx) => {
      await tx
        .update(packages)
        .set({
          isDeleted: true,
          updatedAt: new Date(),
        })
        .where(eq(packages.id, validationResult.data.id));
    });
  } catch (error) {
    console.log(error);
    return {
      error: {
        general: "Gagal menghapus paket",
      },
    };
  }

  return {
    success: true,
    message: "Berhasil menghapus paket",
  };
}
