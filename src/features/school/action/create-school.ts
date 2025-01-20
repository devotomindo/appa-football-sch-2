"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { schoolRoleMembers, schools } from "@/db/drizzle/schema";
import { createServerClient } from "@/db/supabase/server";
import { authGuard } from "@/features/user/guards/auth-guard";
import { v7 as uuidv7 } from "uuid";
import { z } from "zod";
import { zfd } from "zod-form-data";

export type CreateSchoolResponse = Awaited<ReturnType<typeof createSchool>>;

export const createSchool = async function (
  prevState: any,
  formData: FormData,
) {
  // VALIDATION
  const validationResult = await zfd
    .formData({
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
        general: undefined,
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

    await db.transaction(async (tx) => {
      // Get current user
      const userData = (await authGuard()).data;

      if (!userData) {
        throw new Error("User tidak ditemukan");
      }

      // Generate uuid for school
      const schoolId = uuidv7();

      // insert school
      const schoolName = validationResult.data.name;
      const schoolAddress = validationResult.data.address;
      const schoolHomebase = validationResult.data.homebase;
      const schoolPhone = validationResult.data.phone;
      const schoolCity = validationResult.data.city;

      if (validationResult.data.logo) {
        const logo = validationResult.data.logo;

        // Upload logo
        const { data, error } = await supabase.storage
          .from("logos")
          .upload(schoolId, logo);

        if (error) {
          console.error(error);
          throw new Error("Gagal mengupload logo");
        }

        const insertedId = await tx
          .insert(schools)
          .values({
            id: schoolId,
            name: schoolName,
            address: schoolAddress,
            fieldLocation: schoolHomebase,
            phone: schoolPhone,
            domisiliKota: schoolCity,
            imagePath: data.fullPath,
          })
          .returning({ id: schools.id })
          .then((res) => res[0].id);

        return await tx.insert(schoolRoleMembers).values({
          userId: userData?.id,
          schoolId: insertedId,
          schoolRoleId: 1, // Head Coach ID
        });
      }

      const insertedId = await tx
        .insert(schools)
        .values({
          id: schoolId,
          name: schoolName,
          address: schoolAddress,
          fieldLocation: schoolHomebase,
          phone: schoolPhone,
          domisiliKota: schoolCity,
        })
        .returning({ id: schools.id })
        .then((res) => res[0].id);

      return await tx.insert(schoolRoleMembers).values({
        userId: userData?.id,
        schoolId: insertedId,
        schoolRoleId: 1, // Head Coach ID
      });
    });
  } catch (error) {
    console.error(error);
    throw new Error("Gagal membuat SSB");
  }
};
