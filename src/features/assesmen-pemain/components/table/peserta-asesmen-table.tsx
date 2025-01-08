"use client";

import { Tabs } from "@mantine/core";
import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable,
} from "mantine-react-table";
import { useMemo, useState } from "react";

// type Person = {
//   name: {
//     firstName: string;
//     lastName: string;
//   };
//   address: string;
//   city: string;
//   state: string;
// };

type Peserta = {
  nama: string;
  posisi:
    | "MIDFIELDER"
    | "FORWARD"
    | "GOALKEEPER"
    | "STRIKER"
    | "WINGER"
    | "BACK";
  kelompokUsia: "KU 13" | "KU 15" | "KU 17";
};

//nested data is ok, see accessorKeys in ColumnDef below
// const data: Person[] = [
//   {
//     name: {
//       firstName: "Zachary",
//       lastName: "Davis",
//     },
//     address: "261 Battle Ford",
//     city: "Columbus",
//     state: "Ohio",
//   },
//   {
//     name: {
//       firstName: "Robert",
//       lastName: "Smith",
//     },
//     address: "566 Brakus Inlet",
//     city: "Westerville",
//     state: "West Virginia",
//   },
//   {
//     name: {
//       firstName: "Kevin",
//       lastName: "Yan",
//     },
//     address: "7777 Kuhic Knoll",
//     city: "South Linda",
//     state: "West Virginia",
//   },
//   {
//     name: {
//       firstName: "John",
//       lastName: "Upton",
//     },
//     address: "722 Emie Stream",
//     city: "Huntington",
//     state: "Washington",
//   },
//   {
//     name: {
//       firstName: "Nathan",
//       lastName: "Harris",
//     },
//     address: "1 Kuhic Knoll",
//     city: "Ohiowa",
//     state: "Nebraska",
//   },
// ];

const pesertaData: Peserta[] = [
  {
    nama: "CRISTIANO RONALDO",
    posisi: "STRIKER",
    kelompokUsia: "KU 13",
  },
  {
    nama: "lionel messi",
    posisi: "STRIKER",
    kelompokUsia: "KU 15",
  },
  {
    nama: "de gea",
    posisi: "GOALKEEPER",
    kelompokUsia: "KU 17",
  },
  {
    nama: "Erling Haaland",
    posisi: "FORWARD",
    kelompokUsia: "KU 13",
  },
  {
    nama: "Luka Modrić",
    posisi: "MIDFIELDER",
    kelompokUsia: "KU 15",
  },
  {
    nama: "Lamine Yamal",
    posisi: "WINGER",
    kelompokUsia: "KU 17",
  },
  {
    nama: "Achraf Hakimi",
    posisi: "BACK",
    kelompokUsia: "KU 13",
  },
];

export function PesertaAsesmenTable() {
  const [activeTab, setActiveTab] = useState<string>("semua");
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const columns = useMemo<MRT_ColumnDef<Peserta>[]>(
    () => [
      {
        accessorKey: "nama",
        header: "Nama",
      },
      {
        accessorKey: "posisi",
        header: "Posisi",
      },
      {
        accessorKey: "kelompokUsia",
        header: "Kelompok Usia",
      },
    ],
    [],
  );

  const filteredData = useMemo(() => {
    if (activeTab === "semua") return pesertaData;
    return pesertaData.filter(
      (peserta) => peserta.kelompokUsia === `KU ${activeTab}`,
    );
  }, [activeTab]);

  const table = useMantineReactTable({
    columns,
    data: filteredData,
    enableRowSelection: true,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row.nama, // Use nama as unique identifier
  });

  return (
    <div className="space-y-4">
      <Tabs
        value={activeTab}
        onChange={(value) => setActiveTab(value || "semua")}
        color="dark"
        variant="pills"
        radius="md"
      >
        <Tabs.List className="space-x-4">
          <Tabs.Tab value="semua" className="uppercase">
            semua ku
          </Tabs.Tab>
          <Tabs.Tab value="13" className="uppercase">
            ku 13
          </Tabs.Tab>
          <Tabs.Tab value="15" className="uppercase">
            ku 15
          </Tabs.Tab>
          <Tabs.Tab value="17" className="uppercase">
            ku 17
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <MantineReactTable table={table} />
    </div>
  );
}
