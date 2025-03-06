"use client";

import { ActionIcon, TextInput } from "@mantine/core";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { useState } from "react";

export function TextInputWithAddBtn({
  title,
  value,
  setValue,
  name,
  error,
}: {
  title: string;
  value: string[];
  setValue: (value: string[]) => void;
  name: string;
  error?: string;
}) {
  const handleAddValue = () => {
    setValue([...value, ""]);
  };

  const handleValueChange = (newValue: string, index: number) => {
    const newArr = [...value];
    newArr[index] = newValue;
    setValue(newArr);
  };

  const handleRemoveValue = (index: number) => {
    if (value.length > 1) {
      const newArr = value.filter((_, i) => i !== index);
      setValue(newArr);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-medium capitalize">{title}</h3>
        <ActionIcon
          variant="filled"
          color="blue"
          onClick={handleAddValue}
          size="sm"
        >
          <IconPlus size={16} />
        </ActionIcon>
      </div>
      {value.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <TextInput
            value={item}
            onChange={(e) => handleValueChange(e.target.value, index)}
            className="flex-1 shadow-lg"
            radius="md"
            name={name}
            error={error}
          />
          {value.length > 1 && (
            <ActionIcon
              variant="filled"
              color="red"
              onClick={() => handleRemoveValue(index)}
              size="sm"
            >
              <IconMinus size={16} />
            </ActionIcon>
          )}
        </div>
      ))}
    </div>
  );
}

export function KarakterInput({
  posisi,
  error,
  defaultValue = [""],
}: {
  posisi: number;
  error?: string;
  defaultValue?: string[];
}) {
  const [karakter, setKarakter] = useState<string[]>(defaultValue);

  return (
    <TextInputWithAddBtn
      name={`karakter[${posisi}]`}
      title="karakter yang harus dimiliki"
      value={karakter}
      setValue={setKarakter}
      error={error}
    />
  );
}

export function PrinsipInput({
  posisi,
  error,
  defaultValue = [""],
}: {
  posisi: number;
  error?: string;
  defaultValue?: string[];
}) {
  const [prinsip, setPrinsip] = useState<string[]>(defaultValue);

  return (
    <TextInputWithAddBtn
      name={`prinsip[${posisi}]`}
      title="prinsip yang harus dikuasai"
      value={prinsip}
      setValue={setPrinsip}
      error={error}
    />
  );
}

export function PosisiMenyerangInput({
  posisi,
  defaultValue = [""],
}: {
  posisi: number;
  defaultValue?: string[];
}) {
  const [posisiMenyerang, setPosisiMenyerang] =
    useState<string[]>(defaultValue);

  return (
    <TextInputWithAddBtn
      name={`posisiMenyerang[${posisi}]`}
      title="posisi ketika Menyerang"
      value={posisiMenyerang}
      setValue={setPosisiMenyerang}
    />
  );
}

export function PosisiBertahanInput({
  posisi,
  defaultValue = [""],
}: {
  posisi: number;
  defaultValue?: string[];
}) {
  const [posisiBertahan, setPosisiBertahan] = useState<string[]>(defaultValue);

  return (
    <TextInputWithAddBtn
      name={`posisiBertahan[${posisi}]`}
      title="posisi ketika Bertahan"
      value={posisiBertahan}
      setValue={setPosisiBertahan}
    />
  );
}
