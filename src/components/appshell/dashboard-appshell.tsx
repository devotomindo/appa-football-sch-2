"use client";

import type { GetUserByIdResponse } from "@/features/user/actions/get-user-by-id";
import { logout } from "@/features/user/actions/logout";
import { isUserAdmin } from "@/features/user/utils/is-user-admin";
import {
  AppShell,
  Box,
  Burger,
  Button,
  Group,
  Menu,
  NavLink,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconUserCircle, IconUsersGroup } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type DashboardAppshellProps = {
  children: React.ReactNode | React.ReactNode[];
  userData: GetUserByIdResponse;
};

export function DashboardAppshell({
  children,
  userData,
}: DashboardAppshellProps) {
  const [opened, { toggle }] = useDisclosure();
  const pathname = usePathname();

  const isUserAdminValue = isUserAdmin(userData);

  const navLinkStyles = {
    body: {
      paddingInline: ".5rem",
    },
  };

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "lg",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header
        styles={{
          header: {
            borderBottomColor: "black",
          },
        }}
      >
        <Group h="100%" px="md" className="bg-black text-white">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center justify-center space-x-4">
              {/* burger menu and brand logo */}
              <div className="flex items-center space-x-2">
                <Burger
                  opened={opened}
                  onClick={toggle}
                  hiddenFrom="lg"
                  size="sm"
                />

                <UnstyledButton hiddenFrom="lg" onClick={toggle}>
                  Logo Mobile
                </UnstyledButton>

                <Box visibleFrom="lg" className="h-[59px]">
                  {/* Logo */}
                  <div className="relative h-full w-full">
                    <Image
                      src={"/logo-with-text.png"}
                      alt="logo"
                      width={500}
                      height={500}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </Box>
              </div>

              {/* <DatetimeComponent /> */}
            </div>

            {/* user avatar */}
            <div className="flex items-center space-x-1">
              <Menu width={150} shadow="md" trigger="click-hover">
                <Menu.Target>
                  <Button
                    variant="subtle"
                    color="white"
                    leftSection={<IconUserCircle stroke={1.5} />}
                    px={"0.25rem"}
                  >
                    <div className="text-sm font-semibold">{userData.name}</div>
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  <form action={logout}>
                    <Menu.Item type="submit" color="red">
                      Logout
                    </Menu.Item>
                  </form>
                </Menu.Dropdown>
              </Menu>
            </div>
            {/* end of user avatar */}
          </div>
        </Group>
      </AppShell.Header>

      {/* sidebar */}
      <AppShell.Navbar
        className="space-y-8"
        styles={{
          navbar: {
            backgroundColor: "#000000",
            color: "#ffffff",
          },
        }}
      >
        <div className="w-full space-y-4">
          <div className="relative mx-auto mt-4 h-44 w-44 rounded-full border-[8px] border-slate-400">
            <Image
              src={"/sty.jpg"}
              alt=""
              width={500}
              height={500}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <div className="space-y-1 text-center">
            <p className="font-bold">Shin Tae-yong</p>
            <p>Head Coach</p>
          </div>
          <div className="w-full bg-[#E92222] p-2 text-center text-white">
            <p className="uppercase">premium 1 tahun</p>
          </div>
        </div>

        <div className="px-8">
          <div className="h-[1px] w-full bg-black"></div>
        </div>

        <div className="space-y-4">
          <NavLink
            label="Beranda"
            onClick={toggle}
            component={Link}
            href="/dashboard"
            active={pathname === "/dashboard"}
            color={pathname === "/dashboard" ? "#E92222" : ""}
            variant="filled"
            styles={navLinkStyles}
            className="hover:!bg-[#E92222] hover:text-white"
          />
          <NavLink
            label="Daftar Pemain"
            onClick={toggle}
            component={Link}
            href="/dashboard/daftar-pemain"
            active={pathname === "/dashboard/daftar-pemain"}
            color={pathname === "/dashboard/daftar-pemain" ? "#E92222" : ""}
            variant="filled"
            styles={navLinkStyles}
            className="hover:!bg-[#E92222] hover:text-white"
          />
          <NavLink
            label="Daftar Pelatih"
            onClick={toggle}
            component={Link}
            href="/dashboard/daftar-pelatih"
            active={pathname === "/dashboard/daftar-pelatih"}
            color={pathname === "/dashboard/daftar-pelatih" ? "#E92222" : ""}
            variant="filled"
            styles={navLinkStyles}
            className="hover:!bg-[#E92222] hover:text-white"
          />
          <NavLink
            label="Asesmen Pemain"
            onClick={toggle}
            component={Link}
            href="/dashboard/asesmen-pemain"
            active={pathname === "/dashboard/asesmen-pemain"}
            color={pathname === "/dashboard/asesmen-pemain" ? "#E92222" : ""}
            variant="filled"
            styles={navLinkStyles}
            className="hover:!bg-[#E92222] hover:text-white"
          />
          <NavLink
            label="Hasil Asesmen"
            onClick={toggle}
            component={Link}
            href="/dashboard/hasil-asesmen"
            active={pathname === "/dashboard/hasil-asesmen"}
            color={pathname === "/dashboard/hasil-asesmen" ? "#E92222" : ""}
            variant="filled"
            styles={navLinkStyles}
            className="hover:!bg-[#E92222] hover:text-white"
          />
          <NavLink
            label="Metode Latihan Kelompok"
            onClick={toggle}
            component={Link}
            href="/dashboard/metode-latihan-kelompok"
            active={pathname === "/dashboard/metode-latihan-kelompok"}
            color={
              pathname === "/dashboard/metode-latihan-kelompok" ? "#E92222" : ""
            }
            variant="filled"
            styles={navLinkStyles}
            className="hover:!bg-[#E92222] hover:text-white"
          />
          <NavLink
            label="Metode Latihan Individu"
            onClick={toggle}
            component={Link}
            href="/dashboard/metode-latihan-individu"
            active={pathname === "/dashboard/metode-latihan-individu"}
            color={
              pathname === "/dashboard/metode-latihan-individu" ? "#E92222" : ""
            }
            variant="filled"
            styles={navLinkStyles}
            className="hover:!bg-[#E92222] hover:text-white"
          />
          <NavLink
            label="Pengaturan"
            onClick={toggle}
            component={Link}
            href="/dashboard/pengaturan"
            active={pathname === "/dashboard/pengaturan"}
            color={pathname === "/dashboard/pengaturan" ? "#E92222" : ""}
            variant="filled"
            styles={navLinkStyles}
            className="hover:!bg-[#E92222] hover:text-white"
          />
        </div>

        {/* ADMIN MENU */}
        {isUserAdminValue ? (
          <>
            <p className="p-2 text-xs text-gray-500">Admin</p>

            <NavLink
              label="User"
              onClick={toggle}
              component={Link}
              href="/dashboard/admin/user"
              active={pathname?.startsWith("/dashboard/admin/user") ?? false}
              leftSection={<IconUsersGroup size="1.25rem" stroke={1.5} />}
            />
          </>
        ) : null}
        {/* END OF ADMIN MENU */}
      </AppShell.Navbar>
      <AppShell.Main className="bg-gray-100 dark:bg-inherit">
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
