"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { tools } from "@/db/drizzle/schema";
import { createServerClient } from "@/db/supabase/server";
import { authGuard } from "@/features/user/guards/auth-guard";
import { isUserAdmin } from "@/features/user/utils/is-user-admin";
import { compressImageWebp } from "@/lib/utils/media-converter";
import { revalidatePath } from "next/cache";
import { v7 as uuidv7 } from "uuid";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function createTool(prevState: any, formData: FormData) {
  // Validation
  const validationResult = await zfd
    .formData({
      name: zfd.text(z.string().min(1).max(100)),
      image: zfd.file(
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

  if (!validationResult.success) {
    const errorFormatted = validationResult.error.format() as any;

    return {
      error: {
        general: undefined,
        name: errorFormatted.name?._errors,
        image: errorFormatted.image?._errors,
      },
    };
  }

  try {
    const db = createDrizzleConnection();
    const supabase = await createServerClient();
    let result: any;

    await db.transaction(async (tx) => {
      const name = validationResult.data.name;
      const image = validationResult.data.image;

      // Generate UUIDv7
      const id = uuidv7();

      // Get current user
      const userData = (await authGuard()).data;

      if (!userData) {
        result = {
          error: {
            general: "User not found",
          },
        };

        return;
      }

      // Verify is Admin
      const isAdmin = isUserAdmin(userData);
      if (!isAdmin) {
        result = {
          error: {
            general: "Unauthorized",
          },
        };

        return;
      }

      // Upload image to storage if image exists
      if (image) {
        // Convert File to ArrayBuffer
        const buffer = await image.arrayBuffer();

        // Compress the image
        const compressedBuffer = await compressImageWebp({
          buffer,
          quality: 82,
        });

        // Convert Buffer back to File
        const compressedFile = new File(
          [compressedBuffer],
          image.name.replace(/\.[^/.]+$/, "") + ".webp",
          { type: "image/webp" },
        );

        // Upload compressed profile picture
        const { data, error } = await supabase.storage
          .from("tools")
          .upload(id, compressedFile, {
            upsert: true,
          });

        if (error || !data) {
          console.error(error);
          result = {
            error: {
              general: "Error uploading image",
            },
          };

          return;
        }

        await tx.insert(tools).values({
          id,
          name,
          imagePath: data.fullPath,
        });

        result = {
          message: "Alat latihan berhasil ditambahkan",
        };

        return;
      }

      await tx.insert(tools).values({
        id,
        name,
      });

      result = {
        message: "Alat latihan berhasil ditambahkan",
      };
    });

    revalidatePath("/dashboard/admin/daftar-alat-latihan");

    return result;
  } catch (error) {
    console.error(error);
    return {
      error: {
        general: "Terjadi kesalahan saat menambahkan alat latihan",
      },
    };
  }
}
