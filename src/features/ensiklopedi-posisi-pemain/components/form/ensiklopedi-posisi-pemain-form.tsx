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
} from "@/components/text-input/text-input-with-add-btn";
import { GetAllPositionsQueryOptions } from "@/features-data/positions/actions/get-all-positions/query-options";
import { useEffectEvent } from "@/lib/hooks/useEffectEvent";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import {
  Accordion,
  Alert,
  Button,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
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

const daftarPosisi = [
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

export function EnsiklopediPosisiPemainForm({
  isEdit = false,
  initialData,
}: {
  isEdit?: boolean;
  initialData?: GetEnsiklopediByIdResponse;
}) {
  const { data: posisiData } = useQuery(GetAllPositionsQueryOptions());
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      const formData = new FormData(e.currentTarget as HTMLFormElement);

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

  const items = daftarPosisi.map((item, index) => (
    <Accordion.Item key={item.value} value={item.value}>
      <Accordion.Control>{item.value}</Accordion.Control>
      <Accordion.Panel>
        <Select
          label="Pilih Posisi"
          data={posisiData
            ?.filter(
              (position) =>
                !Object.values(selectedPositions).includes(position.id) ||
                selectedPositions[item.value] === position.id,
            )
            .map((position) => ({
              label: position.name,
              value: position.id,
            }))}
          value={selectedPositions[item.value]}
          onChange={(value) => {
            setSelectedPositions((prev) => ({
              ...prev,
              [item.value]: value || "",
            }));
          }}
          searchable
          name={`posisi[${index}]`}
          error={actionState?.error?.posisi}
          allowDeselect
        />
      </Accordion.Panel>
      <Accordion.Panel>
        <KarakterInput
          posisi={index}
          error={actionState?.error?.karakter}
          defaultValue={
            initialData?.daftarPosisi[index]?.karakteristik ?? undefined
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
        />
      </Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      {actionState?.error?.general ? (
        <Alert variant="light" color="red" icon={<IconInfoCircle />} mb="1rem">
          {actionState.error.general}
        </Alert>
      ) : null}
      <TextInput
        label="Nama Formasi"
        placeholder="Masukkan nama formasi contoh: 442, 433, dan lain-lain"
        required
        withAsterisk={false}
        name="nama"
        className="shadow-lg"
        radius={"md"}
        error={actionState?.error?.nama}
        defaultValue={initialData?.namaFormasi}
      />

      <Textarea
        label="Deskripsi Formasi"
        placeholder="Masukkan deskripsi formasi"
        required
        withAsterisk={false}
        name="deskripsi"
        className="shadow-lg"
        radius={"md"}
        error={actionState?.error?.deskripsi}
        defaultValue={initialData?.deskripsiFormasi}
      />

      <Accordion variant="separated" defaultValue="Posisi #1" radius={"md"}>
        {items}
      </Accordion>

      <div className="space-y-8">
        <p className="text-sm font-bold capitalize">
          upload gambar ilustrasi (Wajib Portrait)
        </p>
        <div className="flex gap-8">
          <div className="w-[300px]">
            <div className="text-sm font-bold capitalize">formasi asli</div>
            <FormasiAsliImageInput
              defaultValue={initialData?.gambarFormasiDefault}
            />
          </div>
          <div className="w-[300px]">
            <div className="text-sm font-bold capitalize">
              transisi menyerang
            </div>
            <TransisiMenyerangImageInput
              defaultValue={initialData?.gambarOffense}
            />
          </div>
          <div className="w-[300px]">
            <div className="text-sm font-bold capitalize">
              transisi bertahan
            </div>
            <TransisiBertahanImageInput
              defaultValue={initialData?.gambarDefense}
            />
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
