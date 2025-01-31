"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { assessment_illustrations, assessments } from "@/db/drizzle/schema";
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

export async function editAssesment(prevState: any, formData: FormData) {
  const db = createDrizzleConnection();
  const supabase = await createServerClient();

  const validationResult = await zfd
    .formData({
      assessmentId: zfd.text(z.string().uuid()),
      nama: zfd.text(z.string().min(1, "Nama asesmen harus diisi")),
      kategori: zfd.numeric(z.number()),
      satuan: zfd.text(z.string().min(1, "Satuan harus dipilih")),
      deskripsi: zfd.text(z.string().min(1, "Deskripsi harus diisi")),
      tujuan: zfd.text(z.string().min(1, "Tujuan harus diisi")),
      steps: zfd.repeatable(z.array(StepSchema)),
    })
    .safeParseAsync(formData);

  if (!validationResult.success) {
    const errorFormatted = validationResult.error.format() as any;

    return {
      error: {
        general: undefined,
        nama: errorFormatted.nama?._errors,
        kategori: errorFormatted.kategori?._errors,
        satuan: errorFormatted.satuan?._errors,
        deskripsi: errorFormatted.deskripsi?._errors,
        tujuan: errorFormatted.tujuan?._errors,
        langkahAsesmen: errorFormatted.steps?._errors,
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
        })
        .where(eq(assessments.id, assessmentId));

      // Handle each step
      await Promise.all(
        validationResult.data.steps.map(async (step, index) => {
          let imagePath = undefined;

          // Find existing illustration
          const existing = await tx
            .select()
            .from(assessment_illustrations)
            .where(
              and(
                eq(assessment_illustrations.assessmentId, assessmentId),
                eq(assessment_illustrations.orderNumber, index),
              ),
            )
            .limit(1)
            .then((rows) => rows[0]);

          // Handle image upload and deletion if there's a new image
          if (
            step.image &&
            step.image.size > 0 &&
            step.image.name !== "undefined"
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
              .update(assessment_illustrations)
              .set({
                procedure: step.procedure,
                ...(imagePath ? { imagePath } : {}),
              })
              .where(eq(assessment_illustrations.id, existing.id));
          } else {
            // Create new
            await tx.insert(assessment_illustrations).values({
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
        .from(assessment_illustrations)
        .where(eq(assessment_illustrations.assessmentId, assessmentId));

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
          .delete(assessment_illustrations)
          .where(
            and(
              eq(assessment_illustrations.assessmentId, assessmentId),
              gte(
                assessment_illustrations.orderNumber,
                validationResult.data.steps.length,
              ),
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
