"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { schools } from "@/db/drizzle/schema";
import { createServerClient } from "@/db/supabase/server";
import { authGuard } from "@/features/user/guards/auth-guard";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const updateSchool = async function (
  prevState: any,
  formData: FormData,
) {
  // VALIDATION
  const validationResult = await zfd
    .formData({
      id: zfd.text(z.string().uuid()),
      name: zfd.text(z.string().min(1).max(100)),
      address: zfd.text(z.string().min(1).max(100)),
      homebase: zfd.text(z.string().min(1).max(100)),
      phone: zfd.text(z.string().min(1).max(100).optional()),
      city: zfd.numeric(z.number().int().positive()),
      logo: zfd.file(
        z
          .instanceof(File)
          .refine((val) => val.size < 1024 * 1024 * 5, {
            message: "File foto maksimal 5MB",
          })
          .refine((val) => val.type.includes("image"), {
            message: "File foto harus berupa gambar",
          })
          .optional(),
      ),
    })
    .safeParseAsync(formData);

  // validasi error
  if (!validationResult.success) {
    const errorFormatted = validationResult.error.format() as any;

    return {
      error: {
        general: errorFormatted.id?._errors,
        name: errorFormatted.name?._errors,
        address: errorFormatted.address?._errors,
        homebase: errorFormatted.homebase?._errors,
        phone: errorFormatted.phone?._errors,
        city: errorFormatted.city?._errors,
        logo: errorFormatted.logo?._errors,
      },
    };
  }

  try {
    const db = createDrizzleConnection();
    const supabase = await createServerClient();

    const updateTime = new Date();

    await db.transaction(async (tx) => {
      // Get current user
      const userData = (await authGuard()).data;

      if (!userData) {
        throw new Error("User tidak ditemukan");
      }

      // New School Data
      const schoolId = validationResult.data.id;
      const schoolName = validationResult.data.name;
      const schoolAddress = validationResult.data.address;
      const schoolHomebase = validationResult.data.homebase;
      const schoolPhone = validationResult.data.phone;
      const schoolCity = validationResult.data.city;

      if (validationResult.data.logo) {
        const logo = validationResult.data.logo;

        // Upload logo to supabase
        const { data: logoData, error: logoError } = await supabase.storage
          .from("logos")
          .upload(schoolId, logo, {
            upsert: true, // Overwrite if exists
          });

        if (logoError) {
          console.error(logoError);
          throw new Error("Gagal mengupload logo");
        }

        await tx
          .update(schools)
          .set({
            name: schoolName,
            address: schoolAddress,
            fieldLocation: schoolHomebase,
            phone: schoolPhone,
            domisiliKota: schoolCity,
            imagePath: logoData.fullPath,
            updatedAt: updateTime,
          })
          .where(eq(schools.id, schoolId));
      } else {
        await tx
          .update(schools)
          .set({
            name: schoolName,
            address: schoolAddress,
            fieldLocation: schoolHomebase,
            phone: schoolPhone,
            domisiliKota: schoolCity,
            updatedAt: updateTime,
          })
          .where(eq(schools.id, schoolId));
      }
    });
  } catch (error) {
    console.error(error);
    throw new Error("Gagal mengupdate data sekolah");
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/update-ssb/${validationResult.data.id}`);
  return {
    message: "Berhasil mengupdate data SSB",
  };
};
