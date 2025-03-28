"use client";

import {
  FormasiAsliImageInput,
  PosisiBertahanImageInput,
  PosisiMenyerangImageInput,
  TransisiBertahanImageInput,
  TransisiMenyerangImageInput,
} from "@/components/image-input/image-input";
import {
  KarakterInput,
  PosisiBertahanInput,
  PosisiMenyerangInput,
  PrinsipInput,
} from "@/components/text-input/text-input-with-add-btn";
import Tiptap from "@/components/tiptap/Tiptap";
import { getAllPositionsQueryOptions } from "@/features-data/positions/actions/get-all-positions/query-options";
import { useEffectEvent } from "@/lib/hooks/useEffectEvent";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import { Accordion, Alert, Button, Select, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconInfoCircle } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { redirect, useRouter } from "next/navigation";
import {
  FormEvent,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { createEnskilopediPemain } from "../../actions/create-ensiklopedi-pemain";
import { editEnskilopediPemain } from "../../actions/edit-enskilopedi-pemain";
import { GetEnsiklopediByIdResponse } from "../../actions/get-ensiklopedi-by-id";

export const daftarPosisi = [
  {
    value: "Posisi #1",
  },
  {
    value: "Posisi #2",
  },
  {
    value: "Posisi #3",
  },
  {
    value: "Posisi #4",
  },
  {
    value: "Posisi #5",
  },
  {
    value: "Posisi #6",
  },
  {
    value: "Posisi #7",
  },
  {
    value: "Posisi #8",
  },
  {
    value: "Posisi #9",
  },
  {
    value: "Posisi #10",
  },
  {
    value: "Posisi #11",
  },
];

// Add this helper function at the top of the file
const checkIfImageIsPortrait = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src); // Clean up
      resolve(img.height > img.width);
    };
    img.src = URL.createObjectURL(file);
  });
};

// Add this helper function at the top of the file
const isImageFile = (file: File): boolean => {
  const acceptedImageTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ];
  return acceptedImageTypes.includes(file.type);
};

// Add file size check function
const isValidFileSize = (file: File): boolean => {
  const MAX_SIZE_MB = 5;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
  return file.size <= MAX_SIZE_BYTES;
};

export function EnsiklopediPosisiPemainForm({
  isEdit,
  initialData,
}: {
  isEdit?: boolean;
  initialData?: GetEnsiklopediByIdResponse;
}) {
  const { data: posisiData } = useQuery(getAllPositionsQueryOptions());
  const router = useRouter();
  const [selectedPositions, setSelectedPositions] = useState<{
    [key: string]: string;
  }>({});

  const [actionState, actionDispatch, isActionPending] = useActionState(
    isEdit ? editEnskilopediPemain : createEnskilopediPemain,
    null,
  );

  useEffect(() => {
    if (actionState?.success) {
      notifications.show({
        title: "Success",
        message: actionState.message,
        color: "green",
        icon: <IconCheck />,
        autoClose: 3000,
      });
      router.replace("/dashboard/admin/ensiklopedi-posisi-pemain");
    }
  }, [actionState?.message, actionState?.success, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);

    // Get required images
    const formasiAsliImage = formData.get("gambarFormasiAsli") as File;
    const transisiMenyerangImage = formData.get(
      "gambarTransisiMenyerang",
    ) as File;
    const transisiBertahanImage = formData.get(
      "gambarTransisiBertahan",
    ) as File;

    // Check if required images are present in create mode
    if (!isEdit) {
      if (!formasiAsliImage?.size) {
        notifications.show({
          title: "Error",
          message: "Gambar formasi asli tidak boleh kosong",
          color: "red",
          icon: <IconInfoCircle />,
          autoClose: 3000,
        });
        return;
      }
    }

    // In edit mode, we only need to validate new uploads
    if (isEdit) {
      // Check formasi asli if a new one is being uploaded
      if (formasiAsliImage?.size) {
        if (!isImageFile(formasiAsliImage)) {
          notifications.show({
            title: "Error",
            message:
              "File formasi asli harus berupa gambar (JPG, PNG, GIF, atau WEBP)",
            color: "red",
            icon: <IconInfoCircle />,
            autoClose: 3000,
          });
          return;
        }

        const isPortrait = await checkIfImageIsPortrait(formasiAsliImage);
        if (!isPortrait) {
          notifications.show({
            title: "Error",
            message:
              "Gambar formasi asli harus dalam orientasi portrait (tinggi > lebar)",
            color: "red",
            autoClose: 3000,
          });
          return;
        }

        if (!isValidFileSize(formasiAsliImage)) {
          notifications.show({
            title: "Error",
            message: "Ukuran file formasi asli tidak boleh lebih dari 5MB",
            color: "red",
            icon: <IconInfoCircle />,
            autoClose: 3000,
          });
          return;
        }
      }

      // Check transisi menyerang if a new one is being uploaded
      if (transisiMenyerangImage?.size) {
        if (!isImageFile(transisiMenyerangImage)) {
          notifications.show({
            title: "Error",
            message:
              "File transisi menyerang harus berupa gambar (JPG, PNG, GIF, atau WEBP)",
            color: "red",
            icon: <IconInfoCircle />,
            autoClose: 3000,
          });
          return;
        }

        const isPortrait = await checkIfImageIsPortrait(transisiMenyerangImage);
        if (!isPortrait) {
          notifications.show({
            title: "Error",
            message:
              "Gambar transisi menyerang harus dalam orientasi portrait (tinggi > lebar)",
            color: "red",
            autoClose: 3000,
          });
          return;
        }

        if (!isValidFileSize(transisiMenyerangImage)) {
          notifications.show({
            title: "Error",
            message:
              "Ukuran file transisi menyerang tidak boleh lebih dari 5MB",
            color: "red",
            icon: <IconInfoCircle />,
            autoClose: 3000,
          });
          return;
        }
      }

      // Check transisi bertahan if a new one is being uploaded
      if (transisiBertahanImage?.size) {
        if (!isImageFile(transisiBertahanImage)) {
          notifications.show({
            title: "Error",
            message:
              "File transisi bertahan harus berupa gambar (JPG, PNG, GIF, atau WEBP)",
            color: "red",
            icon: <IconInfoCircle />,
            autoClose: 3000,
          });
          return;
        }

        const isPortrait = await checkIfImageIsPortrait(transisiBertahanImage);
        if (!isPortrait) {
          notifications.show({
            title: "Error",
            message:
              "Gambar transisi bertahan harus dalam orientasi portrait (tinggi > lebar)",
            color: "red",
            autoClose: 3000,
          });
          return;
        }

        if (!isValidFileSize(transisiBertahanImage)) {
          notifications.show({
            title: "Error",
            message: "Ukuran file transisi bertahan tidak boleh lebih dari 5MB",
            color: "red",
            icon: <IconInfoCircle />,
            autoClose: 3000,
          });
          return;
        }
      }
    } else {
      if (formasiAsliImage?.size && !isValidFileSize(formasiAsliImage)) {
        notifications.show({
          title: "Error",
          message: "Ukuran file formasi asli tidak boleh lebih dari 5MB",
          color: "red",
          icon: <IconInfoCircle />,
          autoClose: 3000,
        });
        return;
      }

      if (
        transisiMenyerangImage?.size &&
        !isValidFileSize(transisiMenyerangImage)
      ) {
        notifications.show({
          title: "Error",
          message: "Ukuran file transisi menyerang tidak boleh lebih dari 5MB",
          color: "red",
          icon: <IconInfoCircle />,
          autoClose: 3000,
        });
        return;
      }

      if (
        transisiBertahanImage?.size &&
        !isValidFileSize(transisiBertahanImage)
      ) {
        notifications.show({
          title: "Error",
          message: "Ukuran file transisi bertahan tidak boleh lebih dari 5MB",
          color: "red",
          icon: <IconInfoCircle />,
          autoClose: 3000,
        });
        return;
      }
    }

    // Since we've added individual validation for each image above,
    // we can simplify this section to just collect images
    const imagesToValidate: { file: File; name: string }[] = [];

    if (formasiAsliImage?.size) {
      imagesToValidate.push({ file: formasiAsliImage, name: "Formasi asli" });
    }

    if (transisiMenyerangImage?.size) {
      imagesToValidate.push({
        file: transisiMenyerangImage,
        name: "Transisi menyerang",
      });
    }

    if (transisiBertahanImage?.size) {
      imagesToValidate.push({
        file: transisiBertahanImage,
        name: "Transisi bertahan",
      });
    }

    startTransition(() => {
      // Append idFormasi if in edit mode
      if (initialData?.idFormasi) {
        formData.append("idFormasi", initialData.idFormasi);

        // Append idPosisi for each position in edit mode
        initialData.daftarPosisi.forEach((pos, index) => {
          if (pos.idPosisi) {
            formData.append(`idPosisiFormasi[${index}]`, pos.id);
          }
        });
      }

      actionDispatch(formData);
    });
  };

  const actionEffectEvent = useEffectEvent((state: typeof actionState) => {
    if (state) {
      formStateNotificationHelper({
        state,
        successCallback: () => {
          if (isEdit) {
            redirect(
              `/dashboard/admin/ensiklopedi-posisi-pemain/detail-ensiklopedi-posisi-pemain/${initialData?.idFormasi}`,
            );
          } else {
            redirect("/dashboard/admin/ensiklopedi-posisi-pemain/");
          }
        },
      });
    }
  });

  useEffect(
    () => actionEffectEvent(actionState),
    [actionState, actionEffectEvent],
  );

  useEffect(() => {
    if (initialData) {
      // Set initial selected positions
      const initialPositions: { [key: string]: string } = {};
      initialData.daftarPosisi.forEach((pos, index) => {
        initialPositions[`Posisi #${index + 1}`] = pos.idPosisi;
      });
      setSelectedPositions(initialPositions);
    }
  }, [initialData]);

  const items = daftarPosisi.map((item, index) => {
    // Check if position or character is empty for this index
    const hasError = Boolean(
      actionState?.error?.posisi?.[index] ||
        actionState?.error?.karakter?.[index],
    );

    return (
      <Accordion.Item
        key={item.value}
        value={item.value}
        className={hasError ? "!bg-[#fa52521a]" : ""}
      >
        <Accordion.Control>{item.value}</Accordion.Control>
        <Accordion.Panel>
          <Select
            label="Pilih Posisi"
            data={posisiData
              ?.map((position) => ({
                label: position.name,
                value: position.id,
              }))
              .sort((a, b) => a.label.localeCompare(b.label))}
            value={selectedPositions[item.value]}
            onChange={(value) => {
              setSelectedPositions((prev) => ({
                ...prev,
                [item.value]: value || "",
              }));
            }}
            searchable
            name={`posisi[${index}]`}
            error={actionState?.error?.posisi?.[index]}
            required
            withAsterisk={false}
          />
          {selectedPositions[item.value] && (
            <div className="mt-2 rounded-md bg-gray-600 p-2 text-sm text-white">
              {
                posisiData?.find(
                  (pos) => pos.id === selectedPositions[item.value],
                )?.description
              }
            </div>
          )}
        </Accordion.Panel>
        <Accordion.Panel>
          <KarakterInput
            posisi={index}
            error={actionState?.error?.karakter?.[index]} // Mengakses error untuk karakter spesifik
            defaultValue={
              initialData?.daftarPosisi[index]?.karakteristik ?? undefined
            }
          />
        </Accordion.Panel>
        <Accordion.Panel>
          <PrinsipInput
            posisi={index}
            error={actionState?.error?.karakter?.[index]} // Mengakses error untuk karakter spesifik
            defaultValue={
              initialData?.daftarPosisi[index]?.prinsip ?? undefined
            }
          />
        </Accordion.Panel>
        <Accordion.Panel>
          <PosisiMenyerangInput
            posisi={index}
            defaultValue={
              initialData?.daftarPosisi[index]?.deskripsiOffense ?? undefined
            }
          />
          <PosisiMenyerangImageInput
            posisi={index}
            defaultValue={
              initialData?.daftarPosisi[index]?.gambarOffense ?? undefined
            }
            error={actionState?.error?.gambarPosisiMenyerang?.[index]}
          />
        </Accordion.Panel>
        <Accordion.Panel>
          <PosisiBertahanInput
            posisi={index}
            defaultValue={
              initialData?.daftarPosisi[index]?.deskripsiDefense ?? undefined
            }
          />
          <PosisiBertahanImageInput
            posisi={index}
            defaultValue={
              initialData?.daftarPosisi[index]?.gambarDefense ?? undefined
            }
            error={actionState?.error?.gambarPosisiBertahan?.[index]}
          />
        </Accordion.Panel>
      </Accordion.Item>
    );
  });

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      {actionState?.error?.general ? (
        <Alert variant="light" color="red" icon={<IconInfoCircle />} mb="1rem">
          {actionState.error.general}
        </Alert>
      ) : null}
      <TextInput
        label="Nama Formasi"
        placeholder="Masukkan nama formasi"
        required
        withAsterisk={false}
        name="nama"
        className="shadow-lg"
        radius={"md"}
        error={actionState?.error?.nama}
        defaultValue={initialData?.namaFormasi}
      />

      {/* Replace Textarea with Tiptap */}
      <Tiptap
        name="deskripsi"
        label="Deskripsi Formasi"
        defaultContent={initialData?.deskripsiFormasi || ""}
        error={actionState?.error?.deskripsi}
      />

      <Accordion
        variant="separated"
        multiple
        defaultValue={
          isEdit ? daftarPosisi.map((item) => item.value) : ["Posisi #1"]
        }
        radius={"md"}
      >
        {items}
      </Accordion>

      <div className="space-y-8">
        <p className="text-sm font-bold capitalize">
          upload gambar ilustrasi (Wajib Portrait)
        </p>
        <div className="grid grid-cols-1 place-items-center gap-14 md:grid-cols-2 lg:grid-cols-3 lg:gap-2 xl:gap-14">
          <div className="w-[300px]">
            <div className="text-sm font-bold capitalize">formasi asli</div>
            <FormasiAsliImageInput
              defaultValue={initialData?.gambarFormasiDefault}
              error={actionState?.error?.gambarFormasiAsli}
            />
          </div>
          <div className="w-[300px]">
            <div className="text-sm font-bold capitalize">
              transisi menyerang
            </div>
            <TransisiMenyerangImageInput
              defaultValue={initialData?.gambarOffense}
              error={actionState?.error?.gambarTransisiMenyerang}
            />
            {actionState?.error?.gambarTransisiMenyerang && (
              <div className="mt-1 text-sm text-red-500">
                {actionState.error.gambarTransisiMenyerang}
              </div>
            )}
          </div>
          <div className="w-[300px]">
            <div className="text-sm font-bold capitalize">
              transisi bertahan
            </div>
            <TransisiBertahanImageInput
              defaultValue={initialData?.gambarDefense}
              error={actionState?.error?.gambarTransisiBertahan}
            />
            {actionState?.error?.gambarTransisiBertahan && (
              <div className="mt-1 text-sm text-red-500">
                {actionState.error.gambarTransisiBertahan}
              </div>
            )}
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="ml-auto !bg-green-500 hover:!bg-green-600"
        loading={isActionPending}
      >
        Simpan
      </Button>
    </form>
  );
}
