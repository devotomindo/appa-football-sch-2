"use client";

import { GetAllStudentsBySchoolIdResponse } from "@/features/school/action/get-all-students-by-school-id";
import { getAllStudentsBySchoolIdQueryOptions } from "@/features/school/action/get-all-students-by-school-id/query-options";
import { getDefautTableOptions } from "@/lib/utils/mantine-react-table";
import { Avatar, Badge, Button, Flex, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCrown } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import "dayjs/locale/id";
import {
  MantineReactTable,
  MRT_ColumnDef,
  useMantineReactTable,
} from "mantine-react-table";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ActivatePremiumForStudentForm } from "../form/activate-premium-for-student-form";
import { DeactivatePremiumForStudentForm } from "../form/deactivate-premium-for-student-form";

export function DaftarPemainTable({ schoolId }: { schoolId: string }) {
  // QUERY DATA
  const schoolRegistrants = useQuery(
    getAllStudentsBySchoolIdQueryOptions(schoolId),
  );
  // END OF QUERY DATA

  // State to store selected student for premium activation / deactivation
  const [selectedStudent, setSelectedStudent] = useState<
    GetAllStudentsBySchoolIdResponse[number] | null
  >(null);

  // State to store modals visibility
  const [
    isActivatePremiumModalOpened,
    { open: openActivatePremiumModal, close: closeActivatePremiumModal },
  ] = useDisclosure();

  const [
    isDeactivatePremiumModalOpened,
    { open: openDeactivatePremiumModal, close: closeDeactivatePremiumModal },
  ] = useDisclosure();

  // COLUMNS DEFINITION
  const columns = useMemo<
    MRT_ColumnDef<GetAllStudentsBySchoolIdResponse[number]>[]
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
        Cell: ({ row }) => (
          <Flex align="center" gap="xs">
            {row.original.userFullName}
            {/* {row.original.isPremium && (
              <Tooltip label="Siswa Premium">
                <Badge
                  color="yellow"
                  variant="filled"
                  leftSection={<IconCrown size={14} />}
                >
                  Premium
                </Badge>
              </Tooltip>
            )} */}
          </Flex>
        ),
      },
      {
        accessorKey: "isPremium",
        header: "Status",
        filterVariant: "select",
        filterSelectOptions: [
          { text: "Premium", value: "true" },
          { text: "Regular", value: "false" },
        ],
        Cell: ({ row }) =>
          row.original.isPremium ? (
            <Badge
              color="yellow"
              variant="filled"
              leftSection={<IconCrown size={14} />}
            >
              Premium
            </Badge>
          ) : (
            <Badge color="gray">Regular</Badge>
          ),
        mantineFilterSelectProps: {
          data: [
            { value: "true", label: "Premium" },
            { value: "false", label: "Regular" },
          ],
        },
      },
      {
        accessorKey: "age",
        header: "Umur",
        filterFn: "equals",
      },
      {
        accessorKey: "ageGroup",
        header: "Kelompok Umur",
        filterVariant: "select",
        filterSelectOptions: [
          { text: "U7", value: "U7" },
          { text: "U9", value: "U9" },
          { text: "U11", value: "U11" },
          { text: "U13", value: "U13" },
          { text: "U15", value: "U15" },
          { text: "U17", value: "U17" },
          { text: "U20", value: "U20" },
          { text: "SENIOR", value: "SENIOR" },
        ],
        mantineFilterSelectProps: {
          data: [
            { value: "U7", label: "U7" },
            { value: "U9", label: "U9" },
            { value: "U11", label: "U11" },
            { value: "U13", label: "U13" },
            { value: "U15", label: "U15" },
            { value: "U17", label: "U17" },
            { value: "U20", label: "U20" },
            { value: "SENIOR", label: "SENIOR" },
          ],
        },
      },
      {
        header: "Aksi",
        Cell: ({ row }) => {
          return (
            <div className="flex flex-col gap-2">
              {row.original.isPremium ? (
                <Button
                  color="red"
                  onClick={() => {
                    setSelectedStudent(row.original);
                    openDeactivatePremiumModal();
                  }}
                >
                  Nonaktifkan Premium
                </Button>
              ) : (
                <Button
                  color="green"
                  onClick={() => {
                    setSelectedStudent(row.original);
                    openActivatePremiumModal();
                  }}
                >
                  Aktifkan Premium
                </Button>
              )}
              <Button
                component={Link}
                href={`/dashboard/daftar-pemain/${row.original.id}`}
              >
                Lihat
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
      queryResult: schoolRegistrants,
    }),
    columns,
    enableRowNumbers: true,
    rowNumberDisplayMode: "original",
    data: schoolRegistrants.data ?? [],
    // initialState: {
    //   columnVisibility: {
    //     isPremium: false, // Hide the status column by default, but make it available for filtering
    //   },
    // },
  });

  return (
    <>
      <MantineReactTable table={table} />

      {/* Activate Premium Modal */}
      <Modal
        opened={isActivatePremiumModalOpened}
        onClose={() => {
          closeActivatePremiumModal();
          setSelectedStudent(null);
        }}
        title="Aktifkan Premium"
        centered
      >
        <div>
          Apakah Anda yakin ingin mengaktifkan status premium untuk{" "}
          <span className="font-semibold">{selectedStudent?.userFullName}</span>
          ?
        </div>

        <ActivatePremiumForStudentForm
          studentId={selectedStudent?.id ?? ""}
          schoolId={schoolId}
          onSuccess={() => {
            closeActivatePremiumModal();
            setSelectedStudent(null);
          }}
        />
      </Modal>

      {/* Deactivate Premium Modal */}
      <Modal
        opened={isDeactivatePremiumModalOpened}
        onClose={() => {
          closeDeactivatePremiumModal();
          setSelectedStudent(null);
        }}
        title="Nonaktifkan Premium"
        centered
      >
        <div>
          Apakah Anda yakin ingin menonaktifkan status premium untuk{" "}
          <span className="font-semibold">{selectedStudent?.userFullName}</span>
          ? Jika Anda ingin mengaktifkan kembali status premium{" "}
          {selectedStudent?.userFullName}, Anda harus memiliki transaksi paket
          premium baru.
        </div>
        <DeactivatePremiumForStudentForm
          premiumId={selectedStudent?.premiumAssignmentId}
          schoolId={schoolId}
          onSuccess={() => {
            closeDeactivatePremiumModal();
            setSelectedStudent(null);
          }}
        />
      </Modal>
    </>
  );
}
