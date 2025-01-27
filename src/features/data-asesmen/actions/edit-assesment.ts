"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function editAssesment(prevState: any, formData: FormData) {
  const db = createDrizzleConnection();

  const validationResult = await zfd
    .formData({
      assessmentId: zfd.text(z.string()),
      nama: zfd.text(z.string().min(1, "Nama asesmen harus diisi")),
      kategori: zfd.text(z.string().min(1, "Kategori harus dipilih")),
      satuan: zfd.text(z.string().min(1, "Satuan harus dipilih")),
      deskripsi: zfd.text(z.string().min(1, "Deskripsi harus diisi")),
      tujuan: zfd.text(z.string().min(1, "Tujuan harus diisi")),
      langkahAsesmen: zfd.repeatable(
        z.array(z.string().min(1, "Langkah asesmen harus diisi")),
      ),
      // Handle both new file uploads and existing paths
      image: zfd
        .repeatable(
          z.array(
            z.union([
              zfd.file(),
              z.string(), // Accept empty string for no new file
            ]),
          ),
        )
        .optional(),
      existingImage: zfd
        .repeatable(z.array(z.string()))
        .optional()
        .transform((val) => (val?.length ? val : [])),
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

  // Get the validated data
  //   const {
  //     assessmentId,
  //     nama,
  //     kategori,
  //     satuan,
  //     deskripsi,
  //     tujuan,
  //     langkahAsesmen,
  //     image,
  //     existingImage,
  //   } = validationResult.data;

  //   try {
  //     // Here you would implement the logic to:
  //     // 1. Process new image uploads if any
  //     // 2. Keep existing images that weren't replaced
  //     // 3. Update the assessment record

  //     // TODO: Implement the update logic

  //     return {
  //       success: true,
  //       message: "Data berhasil diperbarui",
  //     };
  //   } catch (error: any) {
  //     return {
  //       success: false,
  //       message: error.message || "Gagal memperbarui data",
  //     };
  //   }
}
