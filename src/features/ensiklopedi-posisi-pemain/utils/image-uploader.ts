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

  const { data: url } = supabase.storage
    .from("default_formation_image")
    .getPublicUrl(`${data.path}`);

  return { url };
}

export async function multipleImageUploaderAndGetURL(
  images: File[],
  path: string,
) {
  const supabase = await createServerClient();

  const URLs: Array<{ publicUrl: string }> = [];

  for (const file of images) {
    const compressedImage = await imageCompressor(file);

    const { error: uploadError, data } = await supabase.storage
      .from(path)
      .upload(`${compressedImage.name}`, compressedImage, {
        upsert: true,
      });

    if (uploadError) throw new Error(`Gagal mengupload gambar ${path}`);

    const { data: publicUrl } = supabase.storage
      .from(path)
      .getPublicUrl(`${data.path}`);

    URLs.push(publicUrl);
  }

  return { URLs };
}
