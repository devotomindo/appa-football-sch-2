"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import {
  assessmentIllustrations,
  assessments,
  assessmentTools,
} from "@/db/drizzle/schema";
import { createServerClient } from "@/db/supabase/server";
import { multipleImageUploader } from "@/lib/utils/image-uploader";
import { getStorageBucketAndPath } from "@/lib/utils/supabase";
import { and, eq, gte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { v7 as uuidv7 } from "uuid";
import { z } from "zod";
import { zfd } from "zod-form-data";

const StepSchema = z.object({
  procedure: z.string().min(1),
  image: z
    .instanceof(File)
    .refine(
      (val) => {
        // Skip validation if it's an empty/undefined file
        if (val.size === 0 && val.name === "undefined") return true;
        return val.size < 1024 * 1024 * 5;
      },
      { message: "File foto maksimal 5MB" },
    )
    .refine(
      (val) => {
        // Skip validation if it's an empty/undefined file
        if (val.size === 0 && val.name === "undefined") return true;
        return val.type.includes("image");
      },
      { message: "File foto harus berupa gambar" },
    )
    .optional(),
});

const toolSchema = z.object({
  id: z.string().min(1, "Pilih alat latihan"),
  quantity: z
    .number()
    .min(1, "Jumlah alat minimal 1")
    .max(100, "Jumlah alat maksimal 100"),
});

export async function editAssesment(prevState: any, formData: FormData) {
  const db = createDrizzleConnection();
  const supabase = await createServerClient();
  const noToolsNeeded = formData.get("no_tools_needed") === "true";
  const toolsJson = formData.get("tools");

  // Manual extraction of steps data
  const stepsData = [];
  let index = 0;
  while (formData.has(`steps[${index}][procedure]`)) {
    const procedure =
      formData.get(`steps[${index}][procedure]`)?.toString() || "";
    const image = formData.get(`steps[${index}][image]`) as File | null;

    if (procedure) {
      stepsData.push({ procedure, image });
    }
    index++;
  }

  // Parse tools JSON before validation
  let tools = [];
  if (!noToolsNeeded && toolsJson) {
    try {
      tools = JSON.parse(toolsJson.toString());
    } catch (error) {
      return {
        error: {
          tools: ["Invalid tools data"],
        },
      };
    }
  }

  // Create an object with all the form data for validation
  const formDataObj = {
    ...Object.fromEntries(formData.entries()),
    tools,
    steps: stepsData,
  };

  const validationResult = await zfd
    .formData({
      assessmentId: zfd.text(z.string().uuid()),
      nama: zfd.text(z.string().min(1, "Nama asesmen harus diisi")),
      kategori: zfd.numeric(z.number()),
      satuan: zfd.text(z.string().min(1, "Satuan harus dipilih")),
      deskripsi: zfd.text(z.string().min(1, "Deskripsi harus diisi")),
      tujuan: zfd.text(z.string().min(1, "Tujuan harus diisi")),
      steps: z
        .array(StepSchema)
        .min(1, "Minimal satu langkah asesmen diperlukan"),
      isHigherGradeBetter: zfd.text(z.enum(["true", "false"])),
      tools: noToolsNeeded
        ? z.array(toolSchema).optional()
        : z
            .array(toolSchema)
            .min(
              1,
              "Jika tidak membutuhkan alat, klik tombol di sebelah kanan",
            ),
    })
    .safeParseAsync(formDataObj);

  if (!validationResult.success) {
    const errorFormatted = validationResult.error.format() as any;

    return {
      error: {
        general:
          errorFormatted.steps?._errors ||
          errorFormatted.steps?.[0]?.image?._errors,
        nama: errorFormatted.nama?._errors,
        kategori: errorFormatted.kategori?._errors,
        satuan: errorFormatted.satuan?._errors,
        deskripsi: errorFormatted.deskripsi?._errors,
        tujuan: errorFormatted.tujuan?._errors,
        langkahAsesmen: errorFormatted.steps?._errors,
        isHigherGradeBetter: errorFormatted.isHigherGradeBetter?._errors,
        tools: errorFormatted.tools?._errors,
      },
    };
  }

  try {
    await db.transaction(async (tx) => {
      const assessmentId = validationResult.data.assessmentId;

      // Update main assessment data
      await tx
        .update(assessments)
        .set({
          name: validationResult.data.nama,
          categoryId: validationResult.data.kategori,
          gradeMetricId: validationResult.data.satuan,
          description: validationResult.data.deskripsi,
          mainGoal: validationResult.data.tujuan,
          isHigherGradeBetter:
            validationResult.data.isHigherGradeBetter === "true" ? true : false,
          updatedAt: new Date(),
        })
        .where(eq(assessments.id, assessmentId));

      // Handle each step
      await Promise.all(
        validationResult.data.steps.map(async (step, index) => {
          let imagePath = undefined;

          // Find existing illustration
          const existing = await tx
            .select()
            .from(assessmentIllustrations)
            .where(
              and(
                eq(assessmentIllustrations.assessmentId, assessmentId),
                eq(assessmentIllustrations.orderNumber, index),
              ),
            )
            .limit(1)
            .then((rows) => rows[0]);

          // Handle image upload and deletion if there's a new image
          if (
            step.image &&
            step.image.size > 0 &&
            step.image.name !== "undefined" &&
            step.image.name !== "placeholder.jpg"
          ) {
            // Delete old image if it exists
            if (existing?.imagePath) {
              const { bucket, path } = getStorageBucketAndPath(
                existing.imagePath,
              );
              await supabase.storage.from(bucket).remove([path]);
            }

            // Upload new image
            const newFileName = `${uuidv7()}.webp`;
            const renamedFile = new File([step.image], newFileName, {
              type: step.image.type,
            });
            const upload = await multipleImageUploader(
              [renamedFile],
              "assessments",
            );
            imagePath = upload.URLs[0].fullPath;
          }

          if (existing) {
            // Update existing
            await tx
              .update(assessmentIllustrations)
              .set({
                procedure: step.procedure,
                ...(imagePath ? { imagePath } : {}),
              })
              .where(eq(assessmentIllustrations.id, existing.id));
          } else {
            // Create new
            await tx.insert(assessmentIllustrations).values({
              id: uuidv7(),
              assessmentId,
              procedure: step.procedure,
              imagePath: imagePath!, // New steps must have image
              orderNumber: index,
            });
          }
        }),
      );

      // Delete any remaining old illustrations and their images
      const oldIllustrations = await tx
        .select()
        .from(assessmentIllustrations)
        .where(eq(assessmentIllustrations.assessmentId, assessmentId));

      const illustrationsToDelete = oldIllustrations.filter(
        (ill) => ill.orderNumber >= validationResult.data.steps.length,
      );

      // Delete old images from storage
      await Promise.all(
        illustrationsToDelete.map(async (ill) => {
          const { bucket, path } = getStorageBucketAndPath(ill.imagePath);
          await supabase.storage.from(bucket).remove([path]);
        }),
      );

      // Delete old illustration records
      if (illustrationsToDelete.length > 0) {
        await tx
          .delete(assessmentIllustrations)
          .where(
            and(
              eq(assessmentIllustrations.assessmentId, assessmentId),
              gte(
                assessmentIllustrations.orderNumber,
                validationResult.data.steps.length,
              ),
            ),
          );
      }

      // Handle tools - first delete existing tools
      await tx
        .delete(assessmentTools)
        .where(eq(assessmentTools.assessmentId, assessmentId));

      // Insert new tools if they exist
      if (
        !noToolsNeeded &&
        validationResult.data.tools &&
        validationResult.data.tools.length > 0
      ) {
        await Promise.all(
          validationResult.data.tools.map((tool) =>
            tx.insert(assessmentTools).values({
              id: uuidv7(),
              assessmentId,
              toolId: tool.id,
              minCount: tool.quantity,
            }),
          ),
        );
      }
    });

    revalidatePath("/dashboard/admin/data-asesmen");
    return { message: "Berhasil mengubah asesmen" };
  } catch (error: any) {
    return { error: { general: error.message } };
  }
}
