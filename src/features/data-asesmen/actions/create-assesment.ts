"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { assessments } from "@/db/drizzle/schema";
import { multipleImageUploaderAndGetURL } from "@/features/ensiklopedi-posisi-pemain/utils/image-uploader";
import { revalidatePath } from "next/cache";
import { v7 as uuidv7 } from "uuid";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function createAssesment(prevState: any, formData: FormData) {
  const db = createDrizzleConnection();

  const validationResult = await zfd
    .formData({
      nama: zfd.text(z.string().min(1)),
      kategori: zfd.numeric(z.number()),
      satuan: zfd.text(z.string().min(1)),
      deskripsi: zfd.text(z.string().min(1)),
      tujuan: zfd.text(z.string().min(1)),
      langkahAsesmen: zfd.repeatable(z.array(z.string().min(1))),
      image: zfd.repeatable(z.array(zfd.file(z.instanceof(File)))),
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
        langkahAsesmen: errorFormatted.langkahAsesmen?._errors,
        image: errorFormatted.image?._errors,
      },
    };
  }

  try {
    await db.transaction(async (tx) => {
      const { URLs } = await multipleImageUploaderAndGetURL(
        validationResult.data?.image,
        "assessments",
      );

      const publicUrls = URLs.map((url) => url.fullPath);

      await tx.insert(assessments).values({
        id: uuidv7(),
        name: validationResult.data?.nama,
        categoryId: validationResult.data?.kategori,
        gradeMetricId: validationResult.data?.satuan,
        description: validationResult.data?.deskripsi,
        mainGoal: validationResult.data?.tujuan,
        procedure: validationResult.data?.langkahAsesmen,
        illustrationPath: publicUrls,
        isHigherGradeBetter: true,
      });
    });
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/dashboard/admin/data-asesmen");

  return {
    success: true,
    message: "Data berhasil disimpan",
  };
}
