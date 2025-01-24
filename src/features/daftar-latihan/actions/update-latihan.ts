"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { trainingProcedure, trainingTools } from "@/db/drizzle/schema";
import { createServerClient } from "@/db/supabase/server";
import { eq } from "drizzle-orm";
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

export async function updateLatihan(prevState: any, formData: FormData) {
  const noToolsNeeded = formData.get("no_tools_needed") === "true";
  const toolsJson = formData.get("tools");

  // Extract langkah from formData first
  const formEntries = Array.from(formData.entries());
  const langkah = formEntries
    .filter(([key]) => key.startsWith("langkah["))
    .map(([_, value]) => value.toString());

  const baseSchema = {
    id: zfd.text(z.string().uuid()),
    video: z.instanceof(File).optional(),
    nama: zfd.text(z.string().min(3).max(100)),
    deskripsi: zfd.text(z.string().min(3).max(500)),
    jumlah: zfd.numeric(z.number().min(2).max(50)),
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
    const now = new Date();
    let result: any;

    await db.transaction(async (tx) => {
      const { id, video, nama, deskripsi, jumlah, luas, tools, langkah } =
        validationResult.data;

      let updatedData: {
        id: string;
      };

      // Only process video if it exists and is a valid File object
      if (video instanceof File && video.size > 0) {
        if (video.size > MAX_FILE_SIZE) {
          result = {
            error: {
              video: ["Ukuran video maksimal 500MB"],
            },
          };
          return;
        }

        if (!ACCEPTED_VIDEO_TYPES.includes(video.type)) {
          result = {
            error: {
              video: ["Format video harus .mp4, .webm, .mov, atau .avi"],
            },
          };
          return;
        }

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("group_exercise_videos")
          .upload(`videos/${id}`, video, {
            upsert: true,
          });

        // Handle on upload error
        if (uploadError || !uploadData) {
          result = {
            error: {
              general: "Terjadi kesalahan saat mengunggah video",
            },
          };
          return;
        }

        // Update with video
        updatedData = await tx
          .update(trainingProcedure)
          .set({
            name: nama,
            description: deskripsi,
            groupSize: jumlah,
            minFieldSize: luas,
            procedure: langkah,
            videoPath: uploadData.fullPath,
            updatedAt: now,
          })
          .where(eq(trainingProcedure.id, id))
          .returning({ id: trainingProcedure.id })
          .then((res) => res[0]);

        if (!updatedData) {
          result = {
            error: {
              general:
                "Terjadi kesalahan saat mengupdate latihan kelompok - video",
            },
          };
          return;
        }
      } else {
        // Update without video
        updatedData = await tx
          .update(trainingProcedure)
          .set({
            name: nama,
            description: deskripsi,
            groupSize: jumlah,
            minFieldSize: luas,
            procedure: langkah,
            updatedAt: now,
          })
          .where(eq(trainingProcedure.id, id))
          .returning({ id: trainingProcedure.id })
          .then((res) => res[0]);

        if (!updatedData) {
          result = {
            error: {
              general:
                "Terjadi kesalahan saat mengupdate latihan kelompok - tanpa video",
            },
          };
          return;
        }
      }

      // Delete existing tools
      await tx.delete(trainingTools).where(eq(trainingTools.trainingId, id));

      // Insert tools if tools exist
      if (tools && tools.length > 0) {
        const toolsData = tools.map((tool) => ({
          id: uuidv7(),
          trainingId: updatedData.id,
          toolId: tool.id,
          minCount: tool.quantity,
          createdAt: now,
          updatedAt: now,
        }));

        await tx.insert(trainingTools).values(toolsData);
      }

      result = {
        message: "Latihan kelompok berhasil dibuat",
      };
    });

    // Revalidate all paths that cache this data
    revalidatePath("/dashboard/admin/daftar-latihan-kelompok");
    revalidatePath(
      `/dashboard/admin/daftar-latihan-kelompok/latihan/${validationResult.data.id}`,
    );
    revalidatePath(
      `/dashboard/admin/daftar-latihan-kelompok/edit/${validationResult.data.id}`,
    );

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
