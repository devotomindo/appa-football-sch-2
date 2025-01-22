import { compressImageWebp } from "./media-converter";

export async function imageCompressor(imageSource: File): Promise<File> {
  const image = imageSource;

  // Convert File to ArrayBuffer
  const buffer = await image.arrayBuffer();

  // Compress the image
  const compressedBuffer = await compressImageWebp({
    buffer,
    quality: 82,
  });

  // Convert Buffer back to File
  const compressedFile = new File(
    [compressedBuffer],
    image.name.replace(/\.[^/.]+$/, "") + ".webp",
    { type: "image/webp" },
  );

  return compressedFile;
}
