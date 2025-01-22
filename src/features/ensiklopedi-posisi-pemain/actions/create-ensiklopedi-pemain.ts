"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import {
  formationPositioning,
  formations,
  positions,
} from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";
import { v7 as uuidv7 } from "uuid";
import { z } from "zod";
import { zfd } from "zod-form-data";
import {
  multipleImageUploaderAndGetURL,
  singleImageUploaderAndGetURL,
} from "../utils/image-uploader";

export async function createEnskilopediPemain(
  prevState: any,
  formData: FormData,
) {
  const validationResult = await zfd
    .formData({
      nama: zfd.text(z.string().min(1)),
      deskripsi: zfd.text(z.string().min(1)),
      posisi: zfd.repeatable(z.array(z.string())),
      karakter: zfd.repeatable(
        z.array(zfd.repeatable(z.array(z.string().min(1)))),
      ),
      posisiMenyerang: zfd.repeatable(
        z.array(zfd.repeatable(z.array(z.string().min(1)))),
      ),
      posisiBertahan: zfd.repeatable(
        z.array(zfd.repeatable(z.array(z.string().min(1)))),
      ),
      gambarPosisiMenyerang: zfd.repeatable(
        z.array(zfd.file(z.instanceof(File))),
      ),
      gambarPosisiBertahan: zfd.repeatable(
        z.array(zfd.file(z.instanceof(File))),
      ),
      gambarFormasiAsli: zfd.file(z.instanceof(File)),
      gambarTransisiMenyerang: zfd.file(z.instanceof(File)),
      gambarTransisiBertahan: zfd.file(z.instanceof(File)),
    })
    .safeParseAsync(formData);

  console.log(validationResult.error);

  const db = createDrizzleConnection();

  if (!validationResult.success) {
    const errorFormatted = validationResult.error.format() as any;

    return {
      error: {
        general: undefined,
        nama: errorFormatted.nama?._errors,
        deskripsi: errorFormatted.deskripsi?._errors,
        posisi: errorFormatted.posisi?._errors,
        karakter: errorFormatted.karakter?._errors,
        posisiMenyerang: errorFormatted.posisiMenyerang?._errors,
        posisiBertahan: errorFormatted.posisiBertahan?._errors,
        gambarPosisiMenyerang: errorFormatted.gambarPosisiMenyerang?._errors,
        gambarPosisiBertahan: errorFormatted.gambarPosisiBertahan?._errors,
        gambarFormasiAsli: errorFormatted.gambarFormasiAsli?._errors,
        gambarTransisiMenyerang:
          errorFormatted.gambarTransisiMenyerang?._errors,
        gambarTransisiBertahan: errorFormatted.gambarTransisiBertahan?._errors,
      },
    };
  }

  try {
    // const supabase = await createServerClient();

    // Upload gambarPosisiMenyerang
    // const menyerangUrls: Array<{ publicUrl: string }> = [];
    // for (const file of validationResult.data.gambarPosisiMenyerang) {
    //   const compressedImage = await imageCompressor(file);

    //   const { error: uploadError, data } = await supabase.storage
    //     .from("offense_illustration")
    //     .upload(`${compressedImage.name}`, compressedImage, {
    //       upsert: true,
    //     });

    //   if (uploadError)
    //     throw new Error("Gagal mengupload gambar ilustrasi posisi menyerang");

    //   const { data: publicUrl } = supabase.storage
    //     .from("offense_illustration")
    //     .getPublicUrl(`${data.path}`);

    //   menyerangUrls.push(publicUrl);
    // }
    const { URLs: gambarPosisiMenyerangURLs } =
      await multipleImageUploaderAndGetURL(
        validationResult.data.gambarPosisiMenyerang,
        "offense_illustration",
      );

    // Upload gambarPosisiBertahan
    // const bertahanUrls: Array<{ publicUrl: string }> = [];
    // for (const file of validationResult.data.gambarPosisiBertahan) {
    //   const compressedImage = await imageCompressor(file);

    //   const { error: uploadError, data } = await supabase.storage
    //     .from("defense_illustration")
    //     .upload(`${compressedImage.name}`, compressedImage, {
    //       upsert: true,
    //     });

    //   if (uploadError)
    //     throw new Error("Gagal mengupload gambar ilustrasi posisi bertahan");

    //   const { data: publicUrl } = supabase.storage
    //     .from("defense_illustration")
    //     .getPublicUrl(`${data.path}`);

    //   bertahanUrls.push(publicUrl);
    // }
    const { URLs: gambarPosisiBertahanURLs } =
      await multipleImageUploaderAndGetURL(
        validationResult.data.gambarPosisiBertahan,
        "defense_illustration",
      );

    // Upload gambarFormasiAsli
    const { url: gambarFormasiAsliURL } = await singleImageUploaderAndGetURL(
      validationResult.data.gambarFormasiAsli,
      "default_formation_image",
    );

    // Upload gambarFormasiBertahan
    const { url: gambarTransisiBertahanURL } =
      await singleImageUploaderAndGetURL(
        validationResult.data.gambarTransisiBertahan,
        "defense_transition_image",
      );

    // Upload gambarFormasiMenyerang
    const { url: gambarTransisiMenyerangURL } =
      await singleImageUploaderAndGetURL(
        validationResult.data.gambarTransisiMenyerang,
        "offense_transition_image",
      );

    const idFormations = uuidv7();

    await db.transaction(async (tx) => {
      // Insert formation first
      await tx.insert(formations).values({
        id: idFormations,
        name: validationResult.data.nama,
        description: validationResult.data.deskripsi,
        defaultFormationImagePath: gambarFormasiAsliURL.publicUrl,
        offenseTransitionImagePath: gambarTransisiMenyerangURL.publicUrl,
        defenseTransitionImagePath: gambarTransisiBertahanURL.publicUrl,
      });

      // Get position IDs for the selected positions
      const positionRecords = [];
      for (const position of validationResult.data.posisi) {
        const id = await tx
          .select({ id: positions.id })
          .from(positions)
          .where(eq(positions.name, position));
        positionRecords.push(id[0]); // Get first result since position names should be unique
      }

      // Insert formation-position relationships
      for (let i = 0; i < positionRecords.length; i++) {
        await tx.insert(formationPositioning).values({
          id: uuidv7(),
          formationId: idFormations,
          positionId: positionRecords[i].id,
          characteristics: validationResult.data.karakter[i],
          offenseDescription: validationResult.data.posisiMenyerang[i],
          offenseIllustrationPath: gambarPosisiMenyerangURLs[i].publicUrl,
          defenseDescription: validationResult.data.posisiBertahan[i],
          defenseIllustrationPath: gambarPosisiBertahanURLs[i].publicUrl,
        });
      }
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Data berhasil disimpan",
  };
}
