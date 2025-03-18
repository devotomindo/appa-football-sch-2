"use client";

import { AppShell, Burger, Button, Text } from "@mantine/core";
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
          borderBottomColor: "black",
        },
        navbar: {},
      }}
    >
      <AppShell.Header className="px-4 text-white">
        <div className="flex h-full flex-row items-center justify-between gap-4">
          <Burger
            opened={opened}
            onClick={toggle}
            hiddenFrom="sm"
            size="sm"
            color="white"
          />
          <div className="relative h-10 w-32 md:h-10 md:w-32 lg:h-20 lg:w-36 xl:h-24 xl:w-44">
            <Image
              src="/logo-with-text.png"
              alt="Logo"
              fill
              className="object-cover"
            />
          </div>
          <div className="hidden flex-row items-center gap-6 capitalize md:flex lg:gap-12 xl:gap-28">
            <Link
              href={"#Home"}
              className="transition-all duration-100 ease-in-out hover:text-red-600"
            >
              <p className="text-xs font-light lg:text-base">home</p>
            </Link>

            <Link
              href={"#Fasilitas"}
              className="transition-all duration-100 ease-in-out hover:text-red-600"
            >
              <p className="text-xs font-light lg:text-base">fasilitas</p>
            </Link>
            <Link
              href={"#Kontak"}
              className="transition-all duration-100 ease-in-out hover:text-red-600"
            >
              <p className="text-xs font-light lg:text-base">kontak</p>
            </Link>
          </div>
          <div className="hidden flex-row items-center gap-4 md:flex xl:gap-8">
            <Link href={"/sign-up"}>
              <p className="text-xs font-light capitalize lg:text-base">
                daftar trial
              </p>
            </Link>
            <Link href={"/login"}>
              <button className="rounded-lg bg-[#FB2201] p-2 text-sm font-medium capitalize transition-all duration-300 ease-in-out hover:bg-[#fb2201b2] md:px-5 md:py-1 lg:px-7 lg:text-base xl:px-10">
                login
              </button>
            </Link>
          </div>
        </div>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <div className="flex h-full flex-col gap-10 capitalize">
          <Link href={"#Home"} className="hover:text-red-600">
            <Text fw={""} size="md">
              home
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
          <Link href={"/sign-up"}>
            <Text className="font-light">daftar trial</Text>
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
        </div>
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
