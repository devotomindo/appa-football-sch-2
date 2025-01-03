"use client";

import { AppShell, Burger, Button, Group, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Image from "next/image";
import Link from "next/link";

type LandingPageAppshellProps = {
  children: React.ReactNode | React.ReactNode[];
};

export default function LandingPageAppshell({
  children,
}: LandingPageAppshellProps) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 100 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened, desktop: true },
      }}
      styles={{
        header: {
          backgroundColor: "black",
        },
      }}
    >
      <AppShell.Header className="text-white">
        <Group h="100%" px="md" justify="space-between">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Image src="/logo-with-text.png" alt="Logo" width={120} height={40} />
          <Group className="capitalize" justify="space-between">
            <Link href={"#Home"} className="hover:text-red-600">
              <Text fw={""} size="md">
                home
              </Text>
            </Link>
            <Link href={"#Program"} className="hover:text-red-600">
              <Text fw={""} size="md">
                program
              </Text>
            </Link>
            <Link href={"#Fasilitas"} className="hover:text-red-600">
              <Text fw={""} size="md">
                fasilitas
              </Text>
            </Link>
            <Link href={"#Kontak"} className="hover:text-red-600">
              <Text fw={""} size="md">
                kontak
              </Text>
            </Link>
          </Group>
          <Group className="capitalize" gap={"xl"}>
            <Link href={"/sign-up"}>
              <Text>daftar trial</Text>
            </Link>
            <Link href={"/login"}>
              <Button
                radius={"md"}
                styles={{
                  root: {
                    backgroundColor: "#FB2201",
                    "&:hover": {
                      backgroundColor: "#FB2201",
                    },
                  },
                }}
                className="capitalize"
              >
                login
              </Button>
            </Link>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">Navbar</AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
