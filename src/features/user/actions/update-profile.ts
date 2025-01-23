// For users to update their own profiles
// Avoids changing the user's role

"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { userProfiles } from "@/db/drizzle/schema";
import { createServerClient } from "@/db/supabase/server";
import { compressImageWebp } from "@/lib/utils/media-converter";
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
      birthDate: zfd.text(z.string()),
      isMale: zfd.text(z.enum(["true", "false"])),
      bodyHeight: zfd.numeric(z.number().int().min(1)),
      bodyWeight: zfd.numeric(z.number().int().min(1)),
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
        bodyHeight: errorFormatted.bodyHeight?._errors,
        bodyWeight: errorFormatted.bodyWeight?._errors,
        isMale: errorFormatted.isMale?._errors,
        birthDate: errorFormatted.birthDate?._errors,
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
      const birthDate = new Date(validationResult.data.birthDate);
      const isMale = validationResult.data.isMale === "true";
      const bodyHeight = validationResult.data.bodyHeight;
      const bodyWeight = validationResult.data.bodyWeight;
      const domisiliKota = validationResult.data.domisiliKota;
      const domisiliProvinsi = validationResult.data.domisiliProvinsi;
      const updatedAt = new Date();

      if (validationResult.data.profilePic) {
        const profilePic = validationResult.data.profilePic;

        // Convert File to ArrayBuffer
        const buffer = await profilePic.arrayBuffer();

        // Compress the image
        const compressedBuffer = await compressImageWebp({
          buffer,
          quality: 82,
        });

        // Convert Buffer back to File
        const compressedFile = new File(
          [compressedBuffer],
          profilePic.name.replace(/\.[^/.]+$/, "") + ".webp",
          { type: "image/webp" },
        );

        // Upload compressed profile picture
        const { data, error } = await supabase.storage
          .from("avatars")
          .upload(validationResult.data.id, compressedFile, {
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
            birthDate: birthDate.toISOString(),
            isMale: isMale,
            bodyHeight: bodyHeight,
            bodyWeight: bodyWeight,
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
          birthDate: birthDate.toISOString(),
          isMale: isMale,
          bodyHeight: bodyHeight,
          bodyWeight: bodyWeight,
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
