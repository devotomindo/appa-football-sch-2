"use client";

import { formatRupiah } from "@/lib/utils/format-rupiah";
import { getDefautTableOptions } from "@/lib/utils/mantine-react-table";
import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from "mantine-react-table";
import { useMemo, useState } from "react";
import { GetAllReferralsResponse } from "../../actions/get-all-referrals";
import { getAllReferralsQueryOptions } from "../../actions/get-all-referrals/query-options";
import { CreateOrUpdateReferralForm } from "../form/create-or-update-referral-form";
import { DisableReferralForm } from "../form/disable-referral-form";

export function ReferralsAdminView() {
  const referralsQuery = useQuery(getAllReferralsQueryOptions());
  const [modalOpen, { open: openModal, close: closeModal }] = useDisclosure();
  const [
    disableModalOpen,
    { open: openDisableModal, close: closeDisableModal },
  ] = useDisclosure();
  const [selectedReferral, setSelectedReferral] = useState<
    GetAllReferralsResponse[number] | undefined
  >();

  const handleSuccess = () => {
    closeModal();
    referralsQuery.refetch();
  };

  const columns = useMemo<MRT_ColumnDef<GetAllReferralsResponse[number]>[]>(
    () => [
      {
        accessorKey: "code",
        header: "Referral Code",
        filterFn: "contains",
      },
      {
        accessorKey: "referrerName",
        header: "Referrer",
        filterFn: "contains",
      },
      {
        accessorKey: "commission",
        header: "Commission",
        filterVariant: "range",
        Cell: ({ row }) => formatRupiah(row.original.commission),
      },
      {
        accessorKey: "discount",
        header: "Discount",
        filterVariant: "range",
        Cell: ({ row }) => formatRupiah(row.original.discount),
      },
      {
        accessorKey: "isActive",
        header: "Status",
        Cell: ({ row }) => (
          <span
            className={`rounded px-2 py-1 text-sm ${
              row.original.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {row.original.isActive ? "Active" : "Inactive"}
          </span>
        ),
        filterVariant: "select",
        filterSelectOptions: [
          { text: "Active", value: "true" },
          { text: "Inactive", value: "false" },
        ],
      },
      {
        accessorKey: "usageCount",
        header: "Times Used",
        filterVariant: "range",
        Cell: ({ row }) => row.original.usageCount.toString(),
      },
      {
        accessorFn: (row) =>
          row.createdAt
            ? dayjs(row.createdAt).format("DD/MM/YYYY, HH:mm:ss")
            : "-",
        id: "createdAt",
        header: "Created At",
        filterVariant: "date-range",
      },
      {
        header: "Actions",
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ row }) => (
          <div className="flex gap-2">
            <Button
              color="blue"
              onClick={() => {
                setSelectedReferral(row.original);
                openModal();
              }}
              disabled={!row.original.isActive}
            >
              Edit
            </Button>
            {row.original.isActive && (
              <Button
                color="red"
                onClick={() => {
                  setSelectedReferral(row.original);
                  openDisableModal();
                }}
              >
                Disable
              </Button>
            )}
          </div>
        ),
      },
    ],
    [openModal],
  );

  const table = useMantineReactTable({
    ...getDefautTableOptions({
      queryResult: referralsQuery,
    }),
    columns,
    enableRowNumbers: true,
    rowNumberDisplayMode: "static",
    data: referralsQuery.data ?? [],
  });

  return (
    <section className="space-y-4">
      <h1 className="text-xl font-bold">Referrals</h1>
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setSelectedReferral(undefined);
            openModal();
          }}
          color="green"
          leftSection={<IconPlus />}
        >
          Tambahkan Kode Referral
        </Button>
      </div>
      <MantineReactTable table={table} />

      <Modal
        opened={modalOpen}
        onClose={closeModal}
        title={
          selectedReferral ? "Edit Kode Referral" : "Tambahkan Kode Referral"
        }
        centered
      >
        <CreateOrUpdateReferralForm
          referralData={selectedReferral}
          onSuccess={handleSuccess}
        />
      </Modal>

      <Modal
        opened={disableModalOpen}
        onClose={closeDisableModal}
        title="Disable Referral Code"
        centered
      >
        {selectedReferral && (
          <DisableReferralForm
            referralData={selectedReferral}
            onSuccess={handleSuccess}
          />
        )}
      </Modal>
    </section>
  );
}
