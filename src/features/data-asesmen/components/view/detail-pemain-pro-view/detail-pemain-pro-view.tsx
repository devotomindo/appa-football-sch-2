"use client";

import { getAllProPlayerAssessmentByIdQueryOptions } from "@/features/data-asesmen/actions/get-all-pro-player-assessment-by-id/query-options";
import { getProPlayerByIdQueryOptions } from "@/features/data-asesmen/actions/get-pro-player-by-id/query-options";
import { Button, Modal } from "@mantine/core";
import { IconArrowLeft, IconEdit, IconTrash } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { MantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AsesmenPemainProForm } from "../../form/asesmen-pemain-pro-form/asesmen-pemain-pro-form";
import { DeleteAsesmenPemainForm } from "../../form/delete-asesmen-pemain-form/delete-asesmen-pemain-form";
import { DeletePemainProForm } from "../../form/delete-pemain-pro-form/delete-pemain-pro-form";

interface AsesmenData {
  namaAsesmen: string;
  satuan: string;
  hasilTerbaru: string;
  hasilTerbaik: string;
  idAsesmen?: string;
}

export function DetailPemainProView({ id }: { id: string }) {
  const { data: proPlayerData } = useQuery(getProPlayerByIdQueryOptions(id));
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletePlayerModalOpen, setIsDeletePlayerModalOpen] = useState(false);
  const { data: proPlayerAssessmentlist } = useQuery(
    getAllProPlayerAssessmentByIdQueryOptions(id),
  );
  const [selectedRow, setSelectedRow] = useState<AsesmenData | null>(null);
  const router = useRouter();

  const data =
    proPlayerAssessmentlist?.map((item) => {
      const bestScore = proPlayerAssessmentlist
        .filter((assessment) => assessment.assessmentId === item.assessmentId)
        .reduce((best, current) => {
          if (item.isHigherGradeBetter) {
            return Number(current.score) > Number(best) ? current.score : best;
          } else {
            return Number(current.score) < Number(best) ? current.score : best;
          }
        }, item.score);

      return {
        namaAsesmen: item.assessmentName ?? "",
        satuan: item.gradeMetric ?? "",
        hasilTerbaru: item.score ?? "",
        hasilTerbaik: bestScore ?? "",
        idAsesmen: item.id,
      };
    }) ?? [];

  const columns: MRT_ColumnDef<AsesmenData>[] = [
    {
      accessorKey: "namaAsesmen",
      header: "Nama Asesmen",
      Cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span>{row.original.namaAsesmen.toUpperCase()}</span>
          <Button
            variant="subtle"
            size="xs"
            p={0}
            className="h-6 w-6 min-w-0"
            onClick={() => {
              setIsEditModalOpen(true);
              setSelectedRow(row.original);
            }}
          >
            <IconEdit size={20} className="text-gray-600" />
          </Button>
          <Button
            variant="subtle"
            size="xs"
            p={0}
            className="h-6 w-6 min-w-0"
            onClick={() => {
              setIsDeleteModalOpen(true);
              setSelectedRow(row.original);
            }}
          >
            <IconTrash size={20} className="!text-red-600" />
          </Button>
        </div>
      ),
    },
    {
      accessorKey: "satuan",
      header: "Satuan",
    },
    {
      accessorKey: "hasilTerbaru",
      header: "Hasil Terbaru",
    },
    {
      accessorKey: "hasilTerbaik",
      header: "Hasil Terbaik",
    },
  ];

  return (
    <div className="space-y-8">
      <Link href={"/dashboard/admin/data-asesmen"}>
        <Button
          className="flex w-32 flex-row items-center justify-center bg-indigo-500 capitalize hover:bg-indigo-600 focus-visible:outline-2"
          leftSection={<IconArrowLeft size={18} />}
        >
          back to data asesmen
        </Button>
      </Link>
      <div className="flex gap-8">
        <div className="relative flex h-48 w-48 items-center justify-center">
          <Image
            src={proPlayerData?.photoUrl || "/messi.png"}
            alt=""
            width={500}
            height={500}
            className="h-full w-3/4 rounded-xl object-cover shadow-xl"
          />
        </div>
        <div className="flex flex-col justify-between">
          <div className="pt-2">
            <p className="text-xl capitalize">{proPlayerData?.playersName}</p>
            <p className="text-[#E92222]">{proPlayerData?.positionName}</p>
          </div>
          <div className="">
            <p className="capitalize">
              {proPlayerData?.countryName} - {proPlayerData?.currentTeam}
            </p>
            <p>{proPlayerData?.age} tahun</p>
            <p>
              {proPlayerData?.height} cm / {proPlayerData?.weight} kg
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <Link
            href={`/dashboard/admin/data-asesmen/detail-pemain-pro/${id}/edit`}
          >
            <Button
              variant="subtle"
              size="xs"
              p={0}
              className="h-6 w-6 min-w-0"
            >
              <IconEdit size={22} className="text-gray-600" />
            </Button>
          </Link>
          <Button
            variant="subtle"
            size="xs"
            p={0}
            className="h-6 w-6 min-w-0"
            onClick={() => {
              setIsDeletePlayerModalOpen(true);
            }}
          >
            <IconTrash size={22} className="!text-red-600" />
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xl font-bold uppercase">hasil asesmen</p>
        <Button
          className="rounded-lg !bg-[#28B826] px-4 py-2 capitalize text-white shadow-xl"
          onClick={() => setIsCreateModalOpen(true)}
        >
          tambah data asesmen
        </Button>
      </div>
      <MantineReactTable
        columns={columns}
        data={data}
        mantineTableProps={{
          className: "rounded-xl overflow-hidden",
        }}
        mantineTableHeadCellProps={{
          style: {
            backgroundColor: "black",
            color: "white",
          },
        }}
        mantineFilterTextInputProps={{
          styles: {
            input: {
              color: "white",
              "&::placeholder": {
                color: "white",
              },
            },
          },
        }}
      />
      <Modal
        opened={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
        }}
        centered
        title="Tambah Data Asesmen"
      >
        <AsesmenPemainProForm
          onSuccess={() => {
            setIsCreateModalOpen(false);
          }}
          proPlayerId={id}
        />
      </Modal>
      <Modal
        opened={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
        }}
        centered
        title="Edit Data Asesmen"
      >
        <AsesmenPemainProForm
          onSuccess={() => {
            setIsEditModalOpen(false);
          }}
          proPlayerId={id}
          data={selectedRow ?? undefined}
        />
      </Modal>
      <Modal
        title="Hapus Data Asesmen?"
        opened={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
        }}
        centered
      >
        <DeleteAsesmenPemainForm
          onSuccess={() => {
            setIsDeleteModalOpen(false);
          }}
          proPlayerId={id}
          assesmentId={selectedRow?.idAsesmen ?? ""}
        />
      </Modal>
      <Modal
        title="Hapus Pemain?"
        opened={isDeletePlayerModalOpen}
        onClose={() => {
          setIsDeletePlayerModalOpen(false);
        }}
        centered
      >
        <DeletePemainProForm
          onSuccess={() => {
            setIsDeletePlayerModalOpen(false);
            router.replace("/dashboard/admin/data-asesmen");
          }}
          proPlayerId={id}
        />
      </Modal>
    </div>
  );
}
