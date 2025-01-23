"use client";

import { Button } from "@mantine/core";
import { IconArrowLeft, IconEdit } from "@tabler/icons-react";
import { MantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import Image from "next/image";
import Link from "next/link";

interface AsesmenData {
  namaAsesmen: string;
  satuan: string;
  hasilTerbaru: string;
  hasilTerbaik: string;
  idAsesmen?: string;
}

export function DetailPemainProView() {
  const data: AsesmenData[] = [
    {
      namaAsesmen: "Lari 100m",
      satuan: "detik",
      hasilTerbaru: "12.5",
      hasilTerbaik: "11.8",
      idAsesmen: "1",
    },
    {
      namaAsesmen: "Push Up",
      satuan: "kali",
      hasilTerbaru: "35",
      hasilTerbaik: "40",
      idAsesmen: "2",
    },
  ];

  const columns: MRT_ColumnDef<AsesmenData>[] = [
    {
      accessorKey: "namaAsesmen",
      header: "Nama Asesmen",
      Cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span>{row.original.namaAsesmen}</span>
          <Button variant="subtle" size="xs" p={0} className="h-6 w-6 min-w-0">
            <Link
              href={`/dashboard/admin/data-asesmen/detail-pemain-pro/edit/${row.original.idAsesmen}`}
            >
              <IconEdit size={16} className="text-gray-600" />
            </Link>
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
            src={"/messi.png"}
            alt=""
            width={500}
            height={500}
            className="h-full w-3/4 rounded-xl object-cover shadow-xl"
          />
        </div>
        <div className="flex flex-col justify-between">
          <div className="pt-2">
            <p className="text-xl capitalize">lionel messi</p>
            <p className="text-[#E92222]">striker</p>
          </div>
          <div className="">
            <p className="capitalize">argentina - FC dallas</p>
            <p>18 tahun</p>
            <p>180 cm / 55 kg</p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xl font-bold uppercase">hasil asesmen</p>
        <Link href={"/dashboard/admin/data-asesmen/detail-pemain-pro/create"}>
          <Button className="rounded-lg !bg-[#28B826] px-4 py-2 capitalize text-white shadow-xl">
            tambah data asesmen
          </Button>
        </Link>
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
    </div>
  );
}
