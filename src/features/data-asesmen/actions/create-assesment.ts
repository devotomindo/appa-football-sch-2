"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { assessmentIllustrations, assessments } from "@/db/drizzle/schema";
import { multipleImageUploader } from "@/lib/utils/image-uploader";
import { revalidatePath } from "next/cache";
import { v7 as uuidv7 } from "uuid";
import { z } from "zod";
import { zfd } from "zod-form-data";

const StepSchema = z.object({
  procedure: z.string().min(1),
  image: z
    .instanceof(File, {
      message: "Langkah asesmen harus disertai gambar ilustrasi",
    })
    .refine((val) => val.size < 1024 * 1024 * 5, {
      message: "File foto maksimal 5MB",
    })
    .refine((val) => val.type.includes("image"), {
      message: "File foto harus berupa gambar",
    }),
});

export async function createAssesment(prevState: any, formData: FormData) {
  const db = createDrizzleConnection();

  const validationResult = await zfd
    .formData({
      nama: zfd.text(z.string().min(1)),
      kategori: zfd.numeric(z.number()),
      satuan: zfd.text(z.string().min(1)),
      deskripsi: zfd.text(z.string().min(1)),
      tujuan: zfd.text(z.string().min(1)),
      steps: zfd.repeatable(z.array(StepSchema)),
      isHigherGradeBetter: zfd.text(z.enum(["true", "false"])),
    })
    .safeParseAsync(formData);

  if (!validationResult.success) {
    const errorFormatted = validationResult.error.format() as any;

    return {
      error: {
        general: errorFormatted.steps?.[0].image?._errors,
        nama: errorFormatted.nama?._errors,
        kategori: errorFormatted.kategori?._errors,
        satuan: errorFormatted.satuan?._errors,
        deskripsi: errorFormatted.deskripsi?._errors,
        tujuan: errorFormatted.tujuan?._errors,
        langkahAsesmen: errorFormatted.steps?._errors,
        isHigherGradeBetter: errorFormatted.isHigherGradeBetter?._errors,
      },
    };
  }

  try {
    await db.transaction(async (tx) => {
      const assessmentId = uuidv7();

      // Upload all images with UUID filenames
      const imageUploads = await Promise.all(
        validationResult.data.steps.map((step) => {
          const newFileName = `${uuidv7()}.webp`;
          const renamedFile = new File([step.image], newFileName, {
            type: step.image.type,
          });
          return multipleImageUploader([renamedFile], "assessments");
        }),
      );

      await tx.insert(assessments).values({
        id: assessmentId,
        name: validationResult.data.nama,
        categoryId: validationResult.data.kategori,
        gradeMetricId: validationResult.data.satuan,
        description: validationResult.data.deskripsi,
        mainGoal: validationResult.data.tujuan,
        isHigherGradeBetter:
          validationResult.data.isHigherGradeBetter === "true" ? true : false,
      });

      // Insert illustrations with procedures
      await Promise.all(
        validationResult.data.steps.map((step, index) =>
          tx.insert(assessmentIllustrations).values({
            id: uuidv7(),
            assessmentId,
            imagePath: imageUploads[index].URLs[0].fullPath,
            procedure: step.procedure,
            orderNumber: index,
          }),
        ),
      );
    });

    revalidatePath("/dashboard/admin/data-asesmen");
    return { message: "Berhasil membuat asesmen baru" };
  } catch (error: any) {
    return { error: { general: error.message } };
  }
}
