"use client";

import { getCoachRegistrantsBySchoolIdQueryOptions } from "@/features/school/action/get-coach-registrants-by-school-id/query-options";
import { GetSchoolRegistrantsBySchoolIdResponse } from "@/features/school/action/get-school-registrants";
import { AcceptSchoolRegistrantForm } from "@/features/school/form/accept-school-registrant-form";
import { RejectAndDeleteSchoolRegistrantForm } from "@/features/school/form/reject-and-delete-school-registrant-form";
import { getDefautTableOptions } from "@/lib/utils/mantine-react-table";
import { Avatar, Button, Modal } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/id";
import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable,
} from "mantine-react-table";
import { useMemo, useState } from "react";

export function DaftarRegistrasiPelatihTable({
  schoolId,
}: {
  schoolId: string;
}) {
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<
    GetSchoolRegistrantsBySchoolIdResponse[number] | null
  >(null);

  // QUERY DATA
  const schoolCoachRegistrants = useQuery(
    getCoachRegistrantsBySchoolIdQueryOptions(schoolId),
  );
  // END OF QUERY DATA

  // COLUMNS DEFINITION
  const columns = useMemo<
    MRT_ColumnDef<GetSchoolRegistrantsBySchoolIdResponse[number]>[]
  >(
    () => [
      {
        accessorKey: "userImageUrl",
        header: "Foto",
        size: 100,
        Cell: ({ row }) => {
          return (
            <Avatar
              src={row.original.userImageUrl}
              alt={row.original.userFullName ?? ""}
              size={"xl"}
              className="rounded-full"
            />
          );
        },
      },
      {
        accessorKey: "userFullName",
        header: "Nama",
        filterFn: "contains",
      },
      {
        accessorKey: "createdAt",
        header: "Tanggal Pengajuan Pendaftaran",
        filterFn: "date",
        Cell: ({ row }) => {
          return dayjs(row.original.createdAt)
            .locale("id")
            .format("DD MMMM YYYY");
        },
      },
      {
        header: "Aksi",
        Cell: ({ row }) => {
          return (
            <div className="flex gap-2">
              <Button
                color="blue"
                onClick={() => {
                  setSelectedRow(row.original);
                  setIsAcceptModalOpen(true);
                }}
              >
                Terima
              </Button>
              <Button
                color="red"
                onClick={() => {
                  setSelectedRow(row.original);
                  setIsRejectModalOpen(true);
                }}
              >
                Tolak
              </Button>
            </div>
          );
        },
      },
    ],
    [],
  );

  const table = useMantineReactTable({
    ...getDefautTableOptions({
      queryResult: schoolCoachRegistrants,
    }),
    columns,
    enableRowNumbers: true,
    rowNumberDisplayMode: "original",
    data: schoolCoachRegistrants.data ?? [],
  });

  return (
    <>
      <MantineReactTable table={table} />

      {/* Accept Modal */}
      {selectedRow && (
        <Modal
          title="Terima Pendaftaran"
          opened={isAcceptModalOpen}
          onClose={() => {
            setSelectedRow(null);
            setIsAcceptModalOpen(false);
          }}
          centered
        >
          <div className="p-2">
            <div className="mb-2 text-lg">
              Apakah Anda yakin ingin menerima pendaftaran dari{" "}
              <strong>{selectedRow?.userFullName}</strong>?
            </div>
            <AcceptSchoolRegistrantForm
              memberId={selectedRow?.id}
              onSuccess={() => {
                setSelectedRow(null);
                setIsAcceptModalOpen(false);
                schoolCoachRegistrants.refetch();
              }}
            />
          </div>
        </Modal>
      )}

      {/* Reject Modal */}
      {selectedRow && (
        <Modal
          title="Tolak Pendaftaran"
          opened={isRejectModalOpen}
          onClose={() => {
            setSelectedRow(null);
            setIsRejectModalOpen(false);
          }}
          centered
        >
          <div className="p-2">
            <div className="mb-2 text-lg">
              Apakah Anda yakin ingin menolak pendaftaran dari{" "}
              <strong>{selectedRow?.userFullName}</strong>?
            </div>
            <RejectAndDeleteSchoolRegistrantForm
              memberId={selectedRow?.id}
              onSuccess={() => {
                setSelectedRow(null);
                setIsRejectModalOpen(false);
                schoolCoachRegistrants.refetch();
              }}
            />
          </div>
        </Modal>
      )}
    </>
  );
}
