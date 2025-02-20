"use client";

export function validatePortraitImages(files: File[]): Promise<boolean[]> {
  return Promise.all(
    files.map(
      (file) =>
        new Promise<boolean>((resolve) => {
          const img = new Image();
          img.onload = () => {
            URL.revokeObjectURL(img.src);
            resolve(img.height > img.width);
          };
          img.src = URL.createObjectURL(file);
        }),
    ),
  );
}
