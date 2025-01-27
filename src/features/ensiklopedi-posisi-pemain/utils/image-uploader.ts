"use server";

import { createServerClient } from "@/db/supabase/server";
import { imageCompressor } from "@/lib/utils/image-compressor";

export async function singleImageUploaderAndGetURL(image: File, path: string) {
  const supabase = await createServerClient();

  const compressedImageFormasiAsli = await imageCompressor(image);

  const { error, data } = await supabase.storage
    .from(path)
    .upload(`${compressedImageFormasiAsli.name}`, compressedImageFormasiAsli, {
      upsert: true,
    });

  if (error) throw new Error(`Gagal mengupload gambar ${path}`);

  return data.fullPath;
}

export async function multipleImageUploaderAndGetURL(
  images: File[],
  path: string,
) {
  const supabase = await createServerClient();

  const URLs: Array<{ fullPath: string }> = [];

  for (const file of images) {
    const compressedImage = await imageCompressor(file);

    const { error: uploadError, data } = await supabase.storage
      .from(path)
      .upload(`${compressedImage.name}`, compressedImage, {
        upsert: true,
      });

    if (uploadError) throw new Error(`Gagal mengupload gambar ${path}`);

    URLs.push({ fullPath: data.fullPath });
  }

  return { URLs };
}

export async function getImageURL(fullPath: string) {
  const supabase = await createServerClient();
  const [folderName, fileName] = fullPath.split("/");

  const { data } = supabase.storage.from(folderName).getPublicUrl(fileName);

  if (!data) {
    throw new Error(`Gagal mengambil gambar ${fullPath}`);
  }

  return data.publicUrl;
}
