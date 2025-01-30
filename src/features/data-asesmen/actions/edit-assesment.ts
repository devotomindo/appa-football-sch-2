"use server";

import { z } from "zod";
import { zfd } from "zod-form-data";

export async function editAssesment(prevState: any, formData: FormData) {
  // const db = createDrizzleConnection();
  // const supabase = await createServerClient();

  const validationResult = await zfd
    .formData({
      assessmentId: zfd.text(z.string()),
      nama: zfd.text(z.string().min(1, "Nama asesmen harus diisi")),
      kategori: zfd.numeric(z.number()),
      satuan: zfd.text(z.string().min(1, "Satuan harus dipilih")),
      deskripsi: zfd.text(z.string().min(1, "Deskripsi harus diisi")),
      tujuan: zfd.text(z.string().min(1, "Tujuan harus diisi")),
      langkahAsesmen: zfd.repeatable(
        z.array(z.string().min(1, "Langkah asesmen harus diisi")),
      ),
      images: zfd.repeatable(
        z.array(
          z.instanceof(File).refine(
            (file) => {
              // Allow empty files (no new upload)
              if (file.size === 0) return true;
              return file.size < 1024 * 1024 * 5;
            },
            {
              message: "File foto maksimal 5MB",
            },
          ),
        ),
      ),
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
        images: errorFormatted.images?._errors,
      },
    };
  }

  try {
    let result: any;

    // await db.transaction(async (tx) => {
    //   // Get Old Image Paths
    //   result = {
    //     error: {
    //       general: "WIP",
    //     },
    //   };

    //   return;

    //   revalidatePath("/dashboard/admin/data-asesmen");

    //   result = {
    //     success: true,
    //     message: "Berhasil mengubah asesmen",
    //   };
    // });

    return result;
  } catch (error: any) {
    return {
      general: {
        error: error.message,
      },
    };
  }
}
