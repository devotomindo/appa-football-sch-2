"use client";

import { Button, Modal, Select } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { GetUserByIdResponse } from "../../actions/get-user-by-id";

export function InitialSchoolRoleForm(userData: GetUserByIdResponse) {
  const isRegistered = userData.schools.length > 0;

  const [isOpen, { open, close }] = useDisclosure();
  const [role, setRole] = useState<number | null>(null);
  // 1 - Head Coach, 2 - Coach, 3 - Player

  const [schoolId, setSchoolId] = useState<number | null>(null);

  return (
    <>
      <Modal
        opened={!isRegistered && !role}
        onClose={close}
        centered
        title="Apakah Anda Pelatih atau Pemain?"
      >
        <Button onClick={() => setRole(2)}>Pelatih</Button>
        <Button onClick={() => setRole(3)}>Pemain</Button>
      </Modal>

      <Modal
        opened={role !== null}
        onClose={() => {
          setRole(null);
          close();
        }}
        centered
        title="Pilih SSB yang Terdaftar"
      >
        <form>
          <Select></Select>
        </form>
      </Modal>
    </>
  );
}
