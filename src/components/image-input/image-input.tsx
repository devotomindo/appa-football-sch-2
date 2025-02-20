"use client";

import { Button, FileInput } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export function PosisiMenyerangImageInput({
  posisi,
  defaultValue,
  error,
}: {
  posisi: number;
  defaultValue?: string;
  error?: string;
}) {
  const [gambar, setGambar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(defaultValue || "");
  const [wasDeleted, setWasDeleted] = useState(false);

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
    setWasDeleted(true);
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
        placeholder="Upload gambar"
        accept="image/*"
        className="mt-4 shadow-lg"
        radius="md"
        value={gambar}
        onChange={setGambar}
        name={`gambarPosisiMenyerang[${posisi}]`}
        error={error}
      />
      {wasDeleted && (
        <input
          type="hidden"
          name={`deletedPosisiMenyerangImage[${posisi}]`}
          value="true"
        />
      )}
    </div>
  );
}

export function PosisiBertahanImageInput({
  posisi,
  defaultValue,
  error,
}: {
  posisi: number;
  defaultValue?: string;
  error?: string;
}) {
  const [gambar, setGambar] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(defaultValue || "");
  const [wasDeleted, setWasDeleted] = useState(false);

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
    setWasDeleted(true);
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
        placeholder="Upload gambar"
        accept="image/*"
        className="mt-4 shadow-lg"
        radius="md"
        value={gambar}
        onChange={setGambar}
        name={`gambarPosisiBertahan[${posisi}]`}
        error={error}
      />
      {wasDeleted && (
        <input
          type="hidden"
          name={`deletedPosisiBertahanImage[${posisi}]`}
          value="true"
        />
      )}
    </div>
  );
}

export function FormasiAsliImageInput({
  defaultValue,
  error,
}: {
  defaultValue?: string;
  error?: string;
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
        name="gambarFormasiAsli"
        error={error}
      />
    </div>
  );
}

export function TransisiMenyerangImageInput({
  defaultValue,
  error,
}: {
  defaultValue?: string;
  error?: string;
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

  // const handleClear = () => {
  //   setGambar(null);
  //   setPreview("");
  // };

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
          {/* <Button
            leftSection={<IconTrash size={16} />}
            variant="light"
            color="red"
            className="absolute right-2 top-2"
            onClick={handleClear}
          >
            Hapus
          </Button> */}
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
        error={error}
      />
    </div>
  );
}

export function TransisiBertahanImageInput({
  defaultValue,
  error,
}: {
  defaultValue?: string;
  error?: string;
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

  // const handleClear = () => {
  //   setGambar(null);
  //   setPreview("");
  // };

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
          {/* <Button
            leftSection={<IconTrash size={16} />}
            variant="light"
            color="red"
            className="absolute right-2 top-2"
            onClick={handleClear}
          >
            Hapus
          </Button> */}
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
        error={error}
      />
    </div>
  );
}
