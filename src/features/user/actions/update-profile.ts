// For users to update their own profiles
// Avoids changing the user's role

"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { userProfiles } from "@/db/drizzle/schema";
import { createServerClient } from "@/db/supabase/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function updateProfile(prevState: any, formData: FormData) {
  // VALIDATION
  const validationResult = await zfd
    .formData({
      id: zfd.text(z.string().uuid()),
      name: zfd.text(z.string().min(1)),
      profilePic: zfd.file(
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
      domisiliProvinsi: zfd.numeric(z.number().int()),
      domisiliKota: zfd.numeric(z.number().int()),
    })
    .safeParseAsync(formData);

  if (!validationResult.success) {
    const errorFormatted = validationResult.error.format() as any;

    return {
      error: {
        general: errorFormatted.id?._errors,
        name: errorFormatted.name?._errors,
        profilePic: errorFormatted.profilePic?._errors,
        domisiliProvinsi: errorFormatted.domisiliProvinsi?._errors,
        domisiliKota: errorFormatted.domisiliKota?._errors,
      },
    };
  }

  try {
    const db = createDrizzleConnection();
    const supabase = await createServerClient();

    await db.transaction(async (tx) => {
      // update user
      const userId = validationResult.data.id;
      const newName = validationResult.data.name;
      const domisiliKota = validationResult.data.domisiliKota;
      const domisiliProvinsi = validationResult.data.domisiliProvinsi;
      const updatedAt = new Date();

      if (validationResult.data.profilePic) {
        const profilePic = validationResult.data.profilePic;

        // Upload profile picture
        const { data, error } = await supabase.storage
          .from("avatars")
          .upload(validationResult.data.id, profilePic, {
            upsert: true,
          });

        if (error) {
          console.error(error);
          throw new Error("Failed to upload profile picture");
        }

        return await tx
          .update(userProfiles)
          .set({
            name: newName,
            avatarPath: data.fullPath,
            updatedAt: updatedAt,
            domisiliProvinsi: domisiliProvinsi,
            domisiliKota: domisiliKota,
          })
          .where(eq(userProfiles.id, userId));
      }

      await tx
        .update(userProfiles)
        .set({
          name: newName,
          updatedAt: updatedAt,
          domisiliProvinsi: domisiliProvinsi,
          domisiliKota: domisiliKota,
        })
        .where(eq(userProfiles.id, userId));
    });
  } catch (error) {
    console.error("Failed to update profile:", error);
    throw new Error("Failed to update profile");
  }

  revalidatePath("/dashboard", "layout");

  return {
    message: "Profile updated successfully",
  };
}
