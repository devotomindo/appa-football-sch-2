"use client";

import type { GetUserByIdResponse } from "@/features/user/actions/get-user-by-id";
import { logout } from "@/features/user/actions/logout";
import { UserProfileUpdateForm } from "@/features/user/components/form/user-profile-update-form";
import { isUserAdmin } from "@/features/user/utils/is-user-admin";
import { SchoolSession } from "@/lib/session";
import { useSchoolStore } from "@/stores/school-store";
import {
  AppShell,
  Avatar,
  Box,
  Burger,
  Button,
  Group,
  Menu,
  Modal,
  NavLink,
  ScrollArea,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconHome,
  IconHomeFilled,
  IconUserCircle,
  IconUsersGroup,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { SubmitButton } from "../buttons/submit-button";
import { SchoolSwitcher } from "../school-switcher";

type DashboardAppshellProps = {
  children: React.ReactNode | React.ReactNode[];
  userData: GetUserByIdResponse & { avatarUrl?: string };
  initialSchool: SchoolSession | null;
};

const navLinkStyles = {
  body: {
    paddingInline: ".5rem",
  },
};

function NavLinkComponent({
  label,
  path,
  toggle,
  leftSection,
  pathname,
}: {
  label: string;
  path: string;
  toggle: () => void;
  leftSection?: React.ReactNode;
  pathname: string;
}) {
  return (
    <NavLink
      label={label}
      onClick={toggle}
      component={Link}
      href={`/dashboard/${path}` as string}
      active={pathname == `/dashboard/${path}`}
      color={pathname == `/dashboard/${path}` ? "#E92222" : ""}
      variant="filled"
      className="hover:!bg-[#E92222] hover:text-white"
      leftSection={leftSection}
    />
  );
}

export function DashboardAppshell({
  children,
  userData,
  initialSchool,
}: DashboardAppshellProps) {
  const [opened, { toggle }] = useDisclosure();
  const [
    isProfileModalOpen,
    { open: openProfileModal, close: closeProfileModal },
  ] = useDisclosure();
  const pathname = usePathname();
  const { selectedSchool, setSelectedSchool } = useSchoolStore();

  // Initialize store when component mounts
  useEffect(() => {
    const initializeSchool = async () => {
      if (!selectedSchool) {
        // Use initial school from session or first school in list
        const schoolToSet = initialSchool || userData.schools[0];
        if (schoolToSet) {
          await setSelectedSchool(schoolToSet);
        }
      }
    };

    initializeSchool();
  }, []); // Empty dependency array to run only once on mount

  const isUserAdminValue = isUserAdmin(userData);

  const member = true;

  const isProfileComplete = userData.name ? true : false;

  return (
    <>
      <Modal
        opened={isProfileModalOpen || !isProfileComplete}
        onClose={closeProfileModal}
        centered
        title="Update Profile"
        withCloseButton={isProfileComplete}
      >
        <div className="space-y-4">
          <UserProfileUpdateForm userData={userData} />
          <form action={logout}>
            <SubmitButton color="red" fullWidth>
              {" "}
              Keluar{" "}
            </SubmitButton>
          </form>
        </div>
      </Modal>

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
                    color="white"
                  />

                  <UnstyledButton hiddenFrom="lg" onClick={toggle}>
                    Logo Mobile
                  </UnstyledButton>

                  <Box visibleFrom="lg" className="h-[59px]">
                    <Link href={"/"}>
                      <div className="relative h-full w-full">
                        <Image
                          src={"/logo-with-text.png"}
                          alt="logo"
                          width={500}
                          height={500}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </Link>
                  </Box>
                </div>

                {/* <DatetimeComponent /> */}
              </div>

              {/* Center: Add SchoolSwitcher */}

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
                      <div className="text-sm font-semibold">
                        {userData.name}
                      </div>
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
          className=""
          styles={{
            navbar: {
              backgroundColor: "#000000",
              color: "#ffffff",
            },
          }}
          component={ScrollArea}
        >
          <div className="w-full space-y-4">
            <Avatar
              src={userData.avatarUrl ?? undefined}
              size={"10rem"}
              radius={"100%"}
              alt={`Avatar ${userData.name}`}
              name={userData.name ?? undefined}
              color="initials"
              className="mx-auto border-4 border-[#333333]"
            />
            <div className="space-y-1 text-center">
              <p className="font-bold">{userData.name}</p>
              {isUserAdminValue && <p className="uppercase">Admin</p>}

              <div className="flex justify-center">
                {userData.schools.length > 0 && (
                  <SchoolSwitcher schools={userData.schools} />
                )}
              </div>
            </div>
            {!member && (
              <div className="text-center capitalize">
                <p>paket gratis</p>
              </div>
            )}
            <div className="w-full bg-[#E92222] p-2 text-center text-white">
              {member && <p className="uppercase">premium 1 tahun</p>}
              {!member && <Link href="/daftar">daftar disini</Link>}
            </div>
          </div>

          <div className="my-10 px-8">
            <div className="h-[1px] w-full bg-white"></div>
          </div>

          <div className="relative space-y-4">
            <NavLink
              label="Beranda"
              onClick={toggle}
              component={Link}
              href="/dashboard"
              active={pathname === "/dashboard"}
              color={pathname === "/dashboard" ? "#E92222" : ""}
              variant="filled"
              className="hover:!bg-[#E92222] hover:text-white"
              leftSection={
                pathname === "/dashboard" ? (
                  <IconHomeFilled size="1.25rem" stroke={1.5} />
                ) : (
                  <IconHome size="1.25rem" stroke={1.5} />
                )
              }
            />
            {!isUserAdminValue && (
              <>
                <NavLink
                  label="Daftar Pemain"
                  onClick={toggle}
                  component={Link}
                  href="/dashboard/daftar-pemain"
                  active={pathname === "/dashboard/daftar-pemain"}
                  color={
                    pathname === "/dashboard/daftar-pemain" ? "#E92222" : ""
                  }
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
                  color={
                    pathname === "/dashboard/daftar-pelatih" ? "#E92222" : ""
                  }
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
                  color={
                    pathname === "/dashboard/asesmen-pemain" ? "#E92222" : ""
                  }
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
                  color={
                    pathname === "/dashboard/hasil-asesmen" ? "#E92222" : ""
                  }
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
                    pathname === "/dashboard/metode-latihan-kelompok"
                      ? "#E92222"
                      : ""
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
                    pathname === "/dashboard/metode-latihan-individu"
                      ? "#E92222"
                      : ""
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
              </>
            )}

            {/* ADMIN MENU */}
            {isUserAdminValue && (
              <>
                <NavLinkComponent
                  label="Daftar Latihan Kelompok"
                  path="admin/daftar-latihan-kelompok"
                  toggle={toggle}
                  leftSection={<IconUsersGroup size="1.25rem" stroke={1.5} />}
                  pathname={pathname}
                />
                <NavLinkComponent
                  label="Daftar Latihan Individu"
                  path="admin/daftar-latihan-individu"
                  toggle={toggle}
                  leftSection={<IconUsersGroup size="1.25rem" stroke={1.5} />}
                  pathname={pathname}
                />
                <NavLinkComponent
                  label="Ensiklopedi Posisi Pemain"
                  path="admin/ensiklopedi-posisi-pemain"
                  toggle={toggle}
                  leftSection={<IconUsersGroup size="1.25rem" stroke={1.5} />}
                  pathname={pathname}
                />
                <NavLinkComponent
                  label="Data Asesmen"
                  path="admin/data-asesmen"
                  toggle={toggle}
                  leftSection={<IconUsersGroup size="1.25rem" stroke={1.5} />}
                  pathname={pathname}
                />
                <NavLinkComponent
                  label="Daftar Transaksi"
                  path="admin/daftar-transaksi"
                  toggle={toggle}
                  leftSection={<IconUsersGroup size="1.25rem" stroke={1.5} />}
                  pathname={pathname}
                />
                <NavLinkComponent
                  label="Referral Code / Voucher"
                  path="admin/referral-code-voucher"
                  toggle={toggle}
                  leftSection={<IconUsersGroup size="1.25rem" stroke={1.5} />}
                  pathname={pathname}
                />
                <div>
                  <p className="p-2 text-xs text-gray-500">Admin</p>

                  <NavLink
                    label="User"
                    onClick={toggle}
                    component={Link}
                    href="/dashboard/admin/user"
                    active={pathname === "/dashboard/admin/user"}
                    color={
                      pathname === "/dashboard/admin/user" ? "#E92222" : ""
                    }
                    variant="filled"
                    styles={navLinkStyles}
                    className="hover:!bg-[#E92222] hover:text-white"
                    leftSection={<IconUsersGroup size="1.25rem" stroke={1.5} />}
                  />
                </div>
              </>
            )}
            {/* END OF ADMIN MENU */}

            <div className="absolute left-[-25%] top-[10%] -z-10 h-3/4">
              <div className="relative h-full w-1/2">
                <Image
                  src={"/logo-tanpa-teks.png"}
                  alt=""
                  width={500}
                  height={500}
                  className="h-full opacity-15"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
          </div>
        </AppShell.Navbar>
        <AppShell.Main className="bg-gray-100 dark:bg-inherit">
          {children}
        </AppShell.Main>
      </AppShell>
    </>
  );
}
