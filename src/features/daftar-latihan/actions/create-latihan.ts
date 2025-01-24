"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { trainingProcedure, trainingTools } from "@/db/drizzle/schema";
import { createServerClient } from "@/db/supabase/server";
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

const toolSchema = z.object({
  id: z.string().min(1, "Pilih alat latihan"),
  quantity: z
    .number()
    .min(1, "Jumlah alat minimal 1")
    .max(100, "Jumlah alat maksimal 100"),
});

export async function createLatihan(prevState: any, formData: FormData) {
  const noToolsNeeded = formData.get("no_tools_needed") === "true";
  const toolsJson = formData.get("tools");

  // Extract langkah from formData first
  const formEntries = Array.from(formData.entries());
  const langkah = formEntries
    .filter(([key]) => key.startsWith("langkah["))
    .map(([_, value]) => value.toString());

  const baseSchema = {
    video: zfd.file(
      z
        .instanceof(File)
        .refine(
          (file) => file.size <= MAX_FILE_SIZE,
          "Ukuran video maksimal 500MB",
        )
        .refine(
          (file) => ACCEPTED_VIDEO_TYPES.includes(file.type),
          "Format video harus .mp4, .webm, .mov, atau .avi",
        ),
    ),
    nama: zfd.text(z.string().min(3).max(100)),
    deskripsi: zfd.text(z.string().min(3).max(500)),
    jumlah: zfd.numeric(
      formData.get("isIndividual") === "true"
        ? z.number().min(1).max(1)
        : z.number().min(2).max(50),
    ),
    luas: zfd.text(z.string().min(3).max(50)),
  };

  // Parse tools JSON before validation
  let tools = [];
  if (!noToolsNeeded && toolsJson) {
    try {
      tools = JSON.parse(toolsJson.toString());
    } catch (e) {
      return {
        error: {
          tools: ["Invalid tools data"],
        },
      };
    }
  }

  const validationSchema = z.object({
    ...baseSchema,
    tools: noToolsNeeded
      ? z.array(toolSchema).optional()
      : z
          .array(toolSchema)
          .min(1, "Jika tidak membutuhkan alat, klik tombol di sebelah kanan"),
    langkah: z
      .array(z.string().min(3, "Langkah minimal 3 karakter"))
      .min(1, "Minimal satu langkah diperlukan"),
  });

  const validationResult = await validationSchema.safeParseAsync({
    ...Object.fromEntries(formData.entries()),
    tools,
    langkah, // Pass the extracted langkah array
  });

  if (!validationResult.success) {
    const errorFormatted = validationResult.error.format() as any;

    return {
      error: {
        general: "Terjadi kesalahan. Periksa kembali data yang diinput",
        video: errorFormatted.video?._errors,
        nama: errorFormatted.nama?._errors,
        deskripsi: errorFormatted.deskripsi?._errors,
        jumlah: errorFormatted.jumlah?._errors,
        luas: errorFormatted.luas?._errors,
        langkah: errorFormatted.langkah?._errors,
        tools: errorFormatted.tools?._errors,
      },
    };
  }

  try {
    const db = createDrizzleConnection();
    const supabase = await createServerClient();
    let result: any;

    await db.transaction(async (tx) => {
      const { video, nama, deskripsi, jumlah, luas, tools, langkah } =
        validationResult.data;

      // Generate ID for the new latihan kelompok
      const id = uuidv7();

      // Upload video to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("group_exercise_videos")
        .upload(`videos/${id}`, video);

      // Handle on upload error
      if (uploadError || !uploadData) {
        result = {
          error: {
            general: "Terjadi kesalahan saat mengunggah video",
          },
        };
        return;
      }

      // Insert new latihan kelompok
      const insertedData = await tx
        .insert(trainingProcedure)
        .values({
          id,
          name: nama,
          description: deskripsi,
          groupSize: jumlah,
          minFieldSize: luas,
          procedure: langkah, // This will now contain all steps
          videoPath: uploadData.fullPath,
        })
        .returning({ id: trainingProcedure.id })
        .then((res) => res[0]);

      // Use returned ID to confirm successful insert
      if (!insertedData) {
        result = {
          error: {
            general: "Terjadi kesalahan saat membuat latihan kelompok",
          },
        };
        return;
      }

      // Insert tools if tools exist
      if (tools && tools.length > 0) {
        const toolsData = tools.map((tool) => ({
          id: uuidv7(),
          trainingId: insertedData.id,
          toolId: tool.id,
          minCount: tool.quantity,
        }));

        await tx.insert(trainingTools).values(toolsData);
      }

      result = {
        message: "Latihan kelompok berhasil dibuat",
      };
    });

    revalidatePath("/dashboard/admin/daftar-latihan-kelompok");

    return result;
  } catch (error) {
    console.error(error);
    return {
      error: {
        general: "Terjadi kesalahan saat membuat latihan kelompok",
      },
    };
  }
}
