"use server";

import { createServerClient } from "@/db/supabase/server";
import { imageCompressor } from "@/lib/utils/image-compressor";
import { v7 as uuidv7 } from "uuid";

// function getFileExtension(filename: string): string {
//   return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
// }

export async function singleImageUploader(
  image: File,
  path: string,
  existingImage: string = "",
) {
  const supabase = await createServerClient();
  const newFileName = existingImage.length > 0 ? existingImage : uuidv7();

  const compressedImage = await imageCompressor(image);

  const { error, data } = await supabase.storage
    .from(path)
    .upload(newFileName, compressedImage, {
      upsert: true,
    });

  if (error) throw new Error(`Gagal mengupload gambar ${path}`);

  return data.fullPath;
}

export async function multipleImageUploader(
  images: File[],
  path: string,
  existingFileNames: string[] = [],
) {
  const supabase = await createServerClient();
  const URLs: Array<{ fullPath: string }> = [];

  for (let i = 0; i < images.length; i++) {
    const file = images[i];
    // Use existing filename if available, otherwise generate new UUID
    const newFileName = existingFileNames[i] || uuidv7();

    const compressedImage = await imageCompressor(file);

    const { error: uploadError, data } = await supabase.storage
      .from(path)
      .upload(newFileName, compressedImage, {
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
