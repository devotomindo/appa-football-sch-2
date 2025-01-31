"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { assessmentIllustrations, assessments } from "@/db/drizzle/schema";
import { createServerClient } from "@/db/supabase/server";
import { getStorageBucketAndPath } from "@/lib/utils/supabase";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function deleteAssessment(prevState: any, formData: FormData) {
  const validationResult = await zfd
    .formData({
      assessmentId: zfd.text(z.string().min(1)),
    })
    .safeParseAsync(formData);

  if (!validationResult.success) {
    const errorFormatted = validationResult.error.format() as any;

    return {
      error: {
        general: undefined,
        assesmentId: errorFormatted.assessmentId,
      },
    };
  }

  const db = createDrizzleConnection();
  const supabase = await createServerClient();

  try {
    let result: any;
    await db.transaction(async (tx) => {
      // First, check if the assessment exists
      const assessmentExists = await tx
        .select({ id: assessments.id })
        .from(assessments)
        .where(eq(assessments.id, validationResult.data.assessmentId))
        .limit(1);

      if (!assessmentExists.length) {
        result = {
          error: {
            general: "Data asesmen tidak ditemukan",
          },
        };

        return;
      }

      // Get all illustrations before deleting them
      const illustrations = await tx
        .select({
          imagePath: assessmentIllustrations.imagePath,
        })
        .from(assessmentIllustrations)
        .where(
          eq(
            assessmentIllustrations.assessmentId,
            validationResult.data.assessmentId,
          ),
        );

      // Delete illustrations first (foreign key constraint)
      await tx
        .delete(assessmentIllustrations)
        .where(
          eq(
            assessmentIllustrations.assessmentId,
            validationResult.data.assessmentId,
          ),
        );

      // Delete the assessment
      const deleted = await tx
        .delete(assessments)
        .where(eq(assessments.id, validationResult.data.assessmentId))
        .returning({ id: assessments.id });

      if (!deleted.length) {
        throw new Error("Failed to delete assessment");
      }

      // Delete images from storage
      await Promise.all(
        illustrations.map(async ({ imagePath }) => {
          const { bucket, path } = getStorageBucketAndPath(imagePath);
          await supabase.storage.from(bucket).remove([path]);
        }),
      );

      result = {
        success: true,
        message: "Berhasil menghapus asesmen",
      };
    });

    revalidatePath("/dashboard/admin/data-asesmen");
    return result;
  } catch (error: any) {
    console.error("Delete assessment error:", error);
    return {
      error: {
        success: false,
        general: error.message,
      },
    };
  }
}
