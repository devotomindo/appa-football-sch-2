"use client";

import { FileInput } from "@mantine/core";
import Image from "next/image";
import { useEffect, useState } from "react";

export function PosisiMenyerangImageInput({ posisi }: { posisi: number }) {
  const [gambar, setGambar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    if (gambar) {
      const objectUrl = URL.createObjectURL(gambar);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [gambar]);

  return (
    <div className="">
      {preview && (
        <div className="relative mt-2">
          <Image
            src={preview}
            alt="Preview"
            className="h-[300px] rounded-md object-contain shadow-lg"
            width={500}
            height={500}
          />
        </div>
      )}
      <FileInput
        label="Upload Gambar Ilustrasi"
        placeholder="Pilih gambar"
        accept="image/*"
        className="mt-4 shadow-lg"
        radius="md"
        value={gambar}
        onChange={setGambar}
        name={`gambar-posisi-menyerang-${posisi}`}
      />
    </div>
  );
}

export function PosisiBertahanImageInput({ posisi }: { posisi: number }) {
  const [gambar, setGambar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    if (gambar) {
      const objectUrl = URL.createObjectURL(gambar);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [gambar]);

  return (
    <div className="">
      {preview && (
        <div className="relative mt-2">
          <Image
            src={preview}
            alt="Preview"
            className="h-[300px] rounded-md object-contain shadow-lg"
            width={500}
            height={500}
          />
        </div>
      )}
      <FileInput
        label="Upload Gambar Ilustrasi"
        placeholder="Pilih gambar"
        accept="image/*"
        className="mt-4 shadow-lg"
        radius="md"
        value={gambar}
        onChange={setGambar}
        name={`gambar-posisi-bertahan-${posisi}`}
      />
    </div>
  );
}

export function FormasiAsliImageInput() {
  const [gambar, setGambar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    if (gambar) {
      const objectUrl = URL.createObjectURL(gambar);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [gambar]);

  return (
    <div>
      {preview && (
        <div className="relative mt-2">
          <Image
            src={preview}
            alt="Preview"
            className="h-[300px] rounded-md object-contain shadow-lg"
            width={500}
            height={500}
          />
        </div>
      )}
      <FileInput
        placeholder="Pilih File"
        accept="image/*"
        className="mt-4 shadow-lg"
        radius="md"
        value={gambar}
        onChange={setGambar}
        name="gambar-formasi-asli"
      />
    </div>
  );
}

export function TransisiMenyerangImageInput() {
  const [gambar, setGambar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    if (gambar) {
      const objectUrl = URL.createObjectURL(gambar);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [gambar]);

  return (
    <div className="">
      {preview && (
        <div className="relative mt-2">
          <Image
            src={preview}
            alt="Preview"
            className="h-[300px] rounded-md object-contain shadow-lg"
            width={500}
            height={500}
          />
        </div>
      )}
      <FileInput
        placeholder="Pilih File"
        accept="image/*"
        className="mt-4 shadow-lg"
        radius="md"
        value={gambar}
        onChange={setGambar}
        name="gambar-transisi-menyerang"
      />
    </div>
  );
}

export function TransisiBertahanImageInput() {
  const [gambar, setGambar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    if (gambar) {
      const objectUrl = URL.createObjectURL(gambar);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [gambar]);

  return (
    <div className="">
      {preview && (
        <div className="relative mt-2">
          <Image
            src={preview}
            alt="Preview"
            className="h-[300px] rounded-md object-contain shadow-lg"
            width={500}
            height={500}
          />
        </div>
      )}
      <FileInput
        placeholder="Pilih File"
        accept="image/*"
        className="mt-4 shadow-lg"
        radius="md"
        value={gambar}
        onChange={setGambar}
        name="gambar-transisi-bertahan"
      />
    </div>
  );
}
