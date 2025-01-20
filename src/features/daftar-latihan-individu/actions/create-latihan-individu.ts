"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { trainingProcedure } from "@/db/drizzle/schema";
import { createBrowserClient } from "@/db/supabase/browser";
import { revalidatePath } from "next/cache";
import { v7 as uuidv7 } from "uuid";
import { z } from "zod";
import { zfd } from "zod-form-data";

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",
];

export async function CreateLatihanIndividu(
  prevState: any,
  formData: FormData,
) {
  const db = createDrizzleConnection();

  const validationResult = await zfd
    .formData({
      video: zfd.file(
        z
          .instanceof(File)
          .refine(
            (file) => file.size <= MAX_FILE_SIZE,
            "File size must be less than 500MB",
          )
          .refine(
            (file) => ACCEPTED_VIDEO_TYPES.includes(file.type),
            "Only .mp4, .webm, .mov, and .avi formats are supported",
          ),
      ),
      nama: zfd.text(z.string().min(3)),
      deskripsi: zfd.text(z.string().min(3)),
      luas: zfd.text(z.string().min(3)),
      alat: zfd.repeatable(z.array(z.string().min(1))),
      langkah: zfd.repeatable(z.array(z.string().min(1))),
    })
    .safeParseAsync(formData);

  // validasi error
  if (!validationResult.success) {
    const errorFormatted = validationResult.error.format() as any;

    return {
      error: {
        video: errorFormatted.video?._errors,
        nama: errorFormatted.nama?._errors,
        deskripsi: errorFormatted.deskripsi?._errors,
        luas: errorFormatted.luas?._errors,
        alat: errorFormatted.alat?._errors,
        langkah: errorFormatted.langkah?._errors,
      },
    };
  }

  const { storage } = createBrowserClient();
  const file = validationResult.data.video;
  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;

  try {
    const { error: uploadError } = await storage
      .from("group_exercise_videos")
      .upload(`videos/${fileName}`, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) throw uploadError;

    // Get public URL for the uploaded video
    const { data: publicUrl } = storage
      .from("group_exercise_videos")
      .getPublicUrl(`videos/${fileName}`);

    // Continue with database transaction
    await db.transaction(async (tx) => {
      await tx.insert(trainingProcedure).values({
        id: uuidv7(),
        name: validationResult.data.nama,
        tools: validationResult.data.alat,
        procedure: validationResult.data.langkah,
        videoPath: publicUrl.publicUrl, // Store the public URL
        minFieldSize: validationResult.data.luas,
        groupSize: 1,
        description: validationResult.data.deskripsi,
      });
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return {
      success: false,
      message: error.message || "Gagal mengupload video",
    };
  }

  revalidatePath("/dashboard/admin/daftar-latihan-individu");

  return {
    success: true,
    message: "Data berhasil disimpan!",
  };
}
