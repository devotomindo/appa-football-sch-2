"use client";

import { SubmitButton } from "@/components/buttons/submit-button";
import { GetUserByIdResponse } from "@/features/user/actions/get-user-by-id";
import { logout } from "@/features/user/actions/logout";
import { UserProfileUpdateForm } from "@/features/user/components/form/user-profile-update-form";
import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { PendaftaranAtletForm } from "../form/pendaftaran-atlet-form";

export function PendaftaranAtletView({
  userData,
}: {
  userData: GetUserByIdResponse;
}) {
  const [
    isProfileModalOpen,
    { open: openProfileModal, close: closeProfileModal },
  ] = useDisclosure();

  const [
    isPendaftaranModalOpen,
    { open: openPendaftaranModal, close: closePendaftaranModal },
  ] = useDisclosure();

  const isProfileComplete =
    userData.name && userData.domisiliKota && userData.domisiliProvinsi
      ? true
      : false;

  return (
    <div>
      <Modal
        opened={isProfileModalOpen || !isProfileComplete}
        onClose={closeProfileModal}
        centered
        title="Lengkapi Profil Anda"
        withCloseButton={isProfileComplete}
      >
        <div className="space-y-4">
          <UserProfileUpdateForm
            userData={userData}
            onClose={closeProfileModal}
            successCallback={closeProfileModal}
          />
          <form action={logout}>
            <SubmitButton color="red" fullWidth>
              {" "}
              Keluar{" "}
            </SubmitButton>
          </form>
        </div>
      </Modal>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Pendaftaran Atlet</h1>
        <Button leftSection={<IconPlus />} onClick={openPendaftaranModal}>
          Pendaftaran
        </Button>
      </div>
      <Modal
        opened={isPendaftaranModalOpen}
        onClose={closePendaftaranModal}
        centered
        title="Pendaftaran Atlet"
        size={"lg"}
      >
        <PendaftaranAtletForm userData={userData} />
      </Modal>
    </div>
  );
}
