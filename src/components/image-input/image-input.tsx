"use client";

import { Button, FileInput } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export function PosisiMenyerangImageInput({
  posisi,
  defaultValue,
}: {
  posisi: number;
  defaultValue?: string;
}) {
  const [gambar, setGambar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(defaultValue || "");

  useEffect(() => {
    if (gambar) {
      const objectUrl = URL.createObjectURL(gambar);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [gambar]);

  const handleClear = () => {
    setGambar(null);
    setPreview("");
  };

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
          <Button
            leftSection={<IconTrash size={16} />}
            variant="light"
            color="red"
            className="absolute right-2 top-2"
            onClick={handleClear}
          >
            Hapus
          </Button>
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
        name={`gambarPosisiMenyerang[${posisi}]`}
      />
    </div>
  );
}

export function PosisiBertahanImageInput({
  posisi,
  defaultValue,
}: {
  posisi: number;
  defaultValue?: string;
}) {
  const [gambar, setGambar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(defaultValue || "");

  useEffect(() => {
    if (gambar) {
      const objectUrl = URL.createObjectURL(gambar);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [gambar]);

  const handleClear = () => {
    setGambar(null);
    setPreview("");
  };

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
          <Button
            leftSection={<IconTrash size={16} />}
            variant="light"
            color="red"
            className="absolute right-2 top-2"
            onClick={handleClear}
          >
            Hapus
          </Button>
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
        name={`gambarPosisiBertahan[${posisi}]`}
      />
    </div>
  );
}

export function FormasiAsliImageInput({
  defaultValue,
}: {
  defaultValue?: string;
}) {
  const [gambar, setGambar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(defaultValue || "");

  useEffect(() => {
    if (gambar) {
      const objectUrl = URL.createObjectURL(gambar);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [gambar]);

  const handleClear = () => {
    setGambar(null);
    setPreview("");
  };

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
          <Button
            leftSection={<IconTrash size={16} />}
            variant="light"
            color="red"
            className="absolute right-2 top-2"
            onClick={handleClear}
          >
            Hapus
          </Button>
        </div>
      )}
      <FileInput
        placeholder="Pilih File"
        accept="image/*"
        className="mt-4 shadow-lg"
        radius="md"
        value={gambar}
        onChange={setGambar}
        name="gambarFormasiAsli"
      />
    </div>
  );
}

export function TransisiMenyerangImageInput({
  defaultValue,
}: {
  defaultValue?: string;
}) {
  const [gambar, setGambar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(defaultValue || "");

  useEffect(() => {
    if (gambar) {
      const objectUrl = URL.createObjectURL(gambar);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [gambar]);

  const handleClear = () => {
    setGambar(null);
    setPreview("");
  };

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
          <Button
            leftSection={<IconTrash size={16} />}
            variant="light"
            color="red"
            className="absolute right-2 top-2"
            onClick={handleClear}
          >
            Hapus
          </Button>
        </div>
      )}
      <FileInput
        placeholder="Pilih File"
        accept="image/*"
        className="mt-4 shadow-lg"
        radius="md"
        value={gambar}
        onChange={setGambar}
        name="gambarTransisiMenyerang"
      />
    </div>
  );
}

export function TransisiBertahanImageInput({
  defaultValue,
}: {
  defaultValue?: string;
}) {
  const [gambar, setGambar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(defaultValue || "");

  useEffect(() => {
    if (gambar) {
      const objectUrl = URL.createObjectURL(gambar);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [gambar]);

  const handleClear = () => {
    setGambar(null);
    setPreview("");
  };

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
          <Button
            leftSection={<IconTrash size={16} />}
            variant="light"
            color="red"
            className="absolute right-2 top-2"
            onClick={handleClear}
          >
            Hapus
          </Button>
        </div>
      )}
      <FileInput
        placeholder="Pilih File"
        accept="image/*"
        className="mt-4 shadow-lg"
        radius="md"
        value={gambar}
        onChange={setGambar}
        name="gambarTransisiBertahan"
      />
    </div>
  );
}
