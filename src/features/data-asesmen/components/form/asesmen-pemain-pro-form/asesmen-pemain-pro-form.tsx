"use client";

import { Button, Select, TextInput } from "@mantine/core";

export function AsesmenPemainProForm() {
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

      <Select
        label="satuan"
        data={["kali", "detik", "menit", "cm", "m", "ms"].sort((a, b) =>
          a.localeCompare(b),
        )}
        searchable
        name="satuan"
      />

      <TextInput
        label="Skor"
        required
        withAsterisk={false}
        name="skor"
        className="shadow-lg"
        radius={"md"}
      />

      <Button
        type="submit"
        className="ml-auto !bg-green-500 hover:!bg-green-600"
      >
        Simpan
      </Button>
    </form>
  );
}
