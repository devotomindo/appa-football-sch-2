"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { formationPositioning, formations } from "@/db/drizzle/schema";
import { createServerClient } from "@/db/supabase/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function DeleteEnsiklopediPemain(
  prevState: any,
  formData: FormData,
) {
  const validationResult = await zfd
    .formData({
      ensiklopediId: zfd.text(z.string().min(1)),
    })
    .safeParseAsync(formData);

  if (!validationResult.success) {
    const errorFormatted = validationResult.error.format() as any;

    return {
      error: {
        general: undefined,
        ensiklopediId: errorFormatted.assessmentId,
      },
    };
  }

  try {
    const db = createDrizzleConnection();
    const supabase = await createServerClient();

    await db.transaction(async (tx) => {
      // Get formation and positioning data first to get all image paths
      const formationData = await tx.query.formations.findFirst({
        where: eq(formations.id, validationResult.data.ensiklopediId),
      });

      const positioningData = await tx.query.formationPositioning.findMany({
        where: eq(
          formationPositioning.formationId,
          validationResult.data.ensiklopediId,
        ),
      });

      // Delete position-specific illustrations
      for (const position of positioningData) {
        if (position.offenseIllustrationPath) {
          const [bucket, filename] =
            position.offenseIllustrationPath.split("/");
          await supabase.storage.from(bucket).remove([filename]);
        }
        if (position.defenseIllustrationPath) {
          const [bucket, filename] =
            position.defenseIllustrationPath.split("/");
          await supabase.storage.from(bucket).remove([filename]);
        }
      }

      // Delete formation images
      if (formationData) {
        if (formationData.defaultFormationImagePath) {
          const [bucket, filename] =
            formationData.defaultFormationImagePath.split("/");
          await supabase.storage.from(bucket).remove([filename]);
        }
        if (formationData.offenseTransitionImagePath) {
          const [bucket, filename] =
            formationData.offenseTransitionImagePath.split("/");
          await supabase.storage.from(bucket).remove([filename]);
        }
        if (formationData.defenseTransitionImagePath) {
          const [bucket, filename] =
            formationData.defenseTransitionImagePath.split("/");
          await supabase.storage.from(bucket).remove([filename]);
        }
      }

      // Delete positioning data
      await tx
        .delete(formationPositioning)
        .where(
          eq(
            formationPositioning.formationId,
            validationResult.data.ensiklopediId,
          ),
        );

      // Delete formation record
      await tx
        .delete(formations)
        .where(eq(formations.id, validationResult.data.ensiklopediId));
    });
  } catch (error: any) {
    return {
      error: {
        success: false,
        general: error.message,
      },
    };
  }

  revalidatePath("/dashboard/admin/ensiklopedi-posisi-pemain");
  revalidatePath("/dashboard/ensiklopedi-posisi-pemain");

  return {
    success: true,
    message: "Berhasil menghapus ensiklopedi pemain",
  };
}
