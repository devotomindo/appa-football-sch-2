"use client";

import { ActionIcon, Button, Select, Textarea, TextInput } from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { useState } from "react";

export function TambahAsesmenForm() {
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [langkahAsesmen, setLangkahAsesmen] = useState(1);

  const handleAddAsesmen = () => {
    setLangkahAsesmen((prev) => prev + 1);
  };

  const handleRemoveCriteria = () => {
    if (langkahAsesmen > 1) {
      setLangkahAsesmen((prev) => prev - 1);
    }
  };

  const handleFileChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileNames((prev) => {
        const newFileNames = [...prev];
        newFileNames[index] = file.name;
        return newFileNames;
      });
    }
  };

  return (
    <form className="space-y-8">
      <TextInput
        label="Nama Asesmen"
        required
        withAsterisk={false}
        name="nama"
        className="shadow-lg"
        radius={"md"}
      />

      <div className="flex items-center gap-8">
        <Select
          label="Pilih Kategori"
          data={[
            "fisik",
            "mental",
            "teknik",
            "taktik",
            "emosional",
            "sosial & kepemimpinan",
            "kognitif",
          ].sort((a, b) => a.localeCompare(b))}
          searchable
          name="kategori"
        />
        <Select
          label="satuan"
          data={["kali", "detik", "menit", "cm", "m", "ms"].sort((a, b) =>
            a.localeCompare(b),
          )}
          searchable
          name="satuan"
        />
      </div>

      <Textarea
        label="Deskripsi Asesmen"
        required
        withAsterisk={false}
        name="deskripsi"
        className="shadow-lg"
        radius={"md"}
      />
      <TextInput
        label="Tujuan Asesmen"
        required
        withAsterisk={false}
        name="tujuan"
        className="shadow-lg"
        radius={"md"}
      />

      <div className="space-y-4">
        {[...Array(langkahAsesmen)].map((_, index) => (
          <div key={index} className="flex items-end gap-4">
            <div className="flex-1">
              <TextInput
                label={index === 0 ? "Langkah Asesmen" : ""}
                name={`criteria-${index}`}
                required
                className="shadow-lg"
                radius="md"
              />
            </div>
            <div className="w-[400px]">
              <label
                className={`block text-sm ${index === 0 ? "visible" : "invisible"}`}
              >
                Gambar Ilustrasi
              </label>
              <div className="relative h-[36px] w-full rounded-md border-2 border-dashed">
                <input
                  type="file"
                  name={`image-${index}`}
                  className="absolute inset-0 cursor-pointer opacity-0"
                  accept="image/*"
                  onChange={(e) => handleFileChange(index, e)}
                />
                <div className="flex h-full items-center justify-center">
                  <p className="truncate px-2 text-sm text-gray-500">
                    {fileNames[index] || "Upload Gambar Ilustrasi"}
                  </p>
                </div>
              </div>
            </div>
            {index === 0 ? (
              <div className="flex items-end">
                <ActionIcon
                  onClick={handleAddAsesmen}
                  className="h-[36px] w-[36px] !bg-green-500 hover:!bg-green-600"
                  variant="filled"
                  radius="xl"
                >
                  <IconPlus size={16} className="text-white" />
                </ActionIcon>
              </div>
            ) : (
              <div className="flex items-end">
                <ActionIcon
                  color="red"
                  variant="filled"
                  onClick={() => handleRemoveCriteria()}
                  className="h-[36px] w-[36px]"
                  radius="xl"
                >
                  <IconMinus size={16} />
                </ActionIcon>
              </div>
            )}
          </div>
        ))}
      </div>

      <Button
        type="submit"
        className="ml-auto !bg-green-500 hover:!bg-green-600"
      >
        Simpan
      </Button>
    </form>
  );
}
