"use client";

import { isCurrentStudentPremiumQueryOptions } from "@/features/school/action/is-current-student-premium/query-options";
import type { GetUserByIdResponse } from "@/features/user/actions/get-user-by-id";
import { logout } from "@/features/user/actions/logout";
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
  ScrollArea,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconHome,
  IconHomeFilled,
  IconMoneybag,
  IconReceipt,
  IconTool,
  IconUserCircle,
  IconUsersGroup,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { NavLinkComponent } from "../navlink-component/navlink-component";
import { SchoolSwitcher } from "../school-switcher";

type DashboardAppshellProps = {
  children: React.ReactNode | React.ReactNode[];
  userData: GetUserByIdResponse & { avatarUrl?: string };
  initialSchool: SchoolSession | null;
};

export function DashboardAppshell({
  children,
  userData,
  initialSchool,
}: DashboardAppshellProps) {
  const [opened, { toggle }] = useDisclosure();
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
  }, [initialSchool, selectedSchool, setSelectedSchool, userData.schools]);

  const isUserAdminValue = isUserAdmin(userData);

  // Only query for premium status when we have a valid studentId
  const studentId = selectedSchool?.studentId || "";
  const hasValidStudentId = Boolean(studentId && studentId.trim() !== "");

  const premiumStatusQuery = useQuery({
    ...isCurrentStudentPremiumQueryOptions(studentId),
    enabled: hasValidStudentId,
  });

  // Use premium status safely, defaulting to false when no valid data
  const isPremium = hasValidStudentId
    ? premiumStatusQuery.data?.isPremium || false
    : false;

  return (
    <>
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
                    <div className="relative">
                      <Image
                        src={"/logo-with-text.png"}
                        alt=""
                        width={100}
                        height={100}
                        className=""
                      />
                    </div>
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
              <p className="font-bold capitalize">{userData.name}</p>
              {isUserAdminValue && <p className="uppercase">Admin</p>}

              <div className="flex justify-center">
                {userData.schools.length > 0 && (
                  <SchoolSwitcher schools={userData.schools} />
                )}
              </div>
            </div>
            {!isPremium && (
              <div className="text-center capitalize">
                <p>paket gratis</p>
              </div>
            )}
            <div className="w-full bg-[#E92222] p-2 text-center text-white">
              {isPremium && <p className="uppercase">premium</p>}
              {!isPremium && (
                <Link href="/dashboard/daftar-paket" className="uppercase">
                  beli paket
                </Link>
              )}
            </div>
          </div>

          <div className="my-10 px-8">
            <div className="h-[1px] w-full bg-white"></div>
          </div>

          <div className="relative space-y-4">
            <NavLinkComponent
              label="Beranda"
              path=""
              toggle={toggle}
              leftSection={
                pathname === "/dashboard" ? (
                  <IconHomeFilled size="1.25rem" stroke={1.5} />
                ) : (
                  <IconHome size="1.25rem" stroke={1.5} />
                )
              }
              pathname={pathname}
            />
            {!isUserAdminValue && !userData?.schools?.[0] && (
              <NavLinkComponent
                label="Pengaturan"
                path="/pengaturan"
                toggle={toggle}
                leftSection={<IconUsersGroup size="1.25rem" stroke={1.5} />}
                pathname={pathname}
              />
            )}
            {!isUserAdminValue &&
              userData?.schools?.[0]?.role
                .toLowerCase()
                .includes("athlete") && (
                <>
                  <NavLinkComponent
                    label="Pendaftaran Atlet"
                    path="/pendaftaran-atlet"
                    toggle={toggle}
                    leftSection={<IconUsersGroup size="1.25rem" stroke={1.5} />}
                    pathname={pathname}
                  />
                  <NavLinkComponent
                    label="Hasil Asesmen"
                    path="/hasil-asesmen"
                    toggle={toggle}
                    leftSection={<IconUsersGroup size="1.25rem" stroke={1.5} />}
                    pathname={pathname}
                  />
                  <NavLinkComponent
                    label="Metode Latihan Individu"
                    path="/metode-latihan-individu"
                    toggle={toggle}
                    leftSection={<IconUsersGroup size="1.25rem" stroke={1.5} />}
                    pathname={pathname}
                  />
                  <NavLinkComponent
                    label="Ensiklopedi Posisi Pemain"
                    path="/ensiklopedi-posisi-pemain"
                    toggle={toggle}
                    leftSection={<IconUsersGroup size="1.25rem" stroke={1.5} />}
                    pathname={pathname}
                  />
                  <NavLinkComponent
                    label="Pengaturan"
                    path="/pengaturan"
                    toggle={toggle}
                    leftSection={<IconUsersGroup size="1.25rem" stroke={1.5} />}
                    pathname={pathname}
                  />
                </>
              )}

            {!isUserAdminValue &&
              userData?.schools?.[0]?.role.toLowerCase().includes("coach") && (
                <>
                  <NavLinkComponent
                    label="Pendaftaran Atlet"
                    path="/pendaftaran-atlet"
                    toggle={toggle}
                    leftSection={<IconUsersGroup size="1.25rem" stroke={1.5} />}
                    pathname={pathname}
                  />
                  <NavLinkComponent
                    label="Daftar Pemain"
                    path="/daftar-pemain"
                    toggle={toggle}
                    leftSection={<IconUsersGroup size="1.25rem" stroke={1.5} />}
                    pathname={pathname}
                  />
                  <NavLinkComponent
                    label="Daftar Pelatih"
                    path="/daftar-pelatih"
                    toggle={toggle}
                    leftSection={<IconUsersGroup size="1.25rem" stroke={1.5} />}
                    pathname={pathname}
                  />
                  <NavLinkComponent
                    label="Daftar Asesmen"
                    path="/daftar-asesmen"
                    toggle={toggle}
                    leftSection={<IconUsersGroup size="1.25rem" stroke={1.5} />}
                    pathname={pathname}
                  />
                  <NavLinkComponent
                    label="Asesmen Pemain"
                    path="/asesmen-pemain"
                    toggle={toggle}
                    leftSection={<IconUsersGroup size="1.25rem" stroke={1.5} />}
                    pathname={pathname}
                  />
                  <NavLinkComponent
                    label="Metode Latihan Kelompok"
                    path="/metode-latihan-kelompok"
                    toggle={toggle}
                    leftSection={<IconUsersGroup size="1.25rem" stroke={1.5} />}
                    pathname={pathname}
                  />
                  <NavLinkComponent
                    label="Metode Latihan Individu"
                    path="/metode-latihan-individu"
                    toggle={toggle}
                    leftSection={<IconUsersGroup size="1.25rem" stroke={1.5} />}
                    pathname={pathname}
                  />
                  <NavLinkComponent
                    label="Ensiklopedi Posisi Pemain"
                    path="/ensiklopedi-posisi-pemain"
                    toggle={toggle}
                    leftSection={<IconUsersGroup size="1.25rem" stroke={1.5} />}
                    pathname={pathname}
                  />
                  <NavLinkComponent
                    label="Riwayat Transaksi"
                    path="/riwayat-transaksi"
                    toggle={toggle}
                    leftSection={<IconUsersGroup size="1.25rem" stroke={1.5} />}
                    pathname={pathname}
                  />
                  <NavLinkComponent
                    label="Pengaturan"
                    path="/pengaturan"
                    toggle={toggle}
                    leftSection={<IconUsersGroup size="1.25rem" stroke={1.5} />}
                    pathname={pathname}
                  />
                </>
              )}

            {/* ADMIN MENU */}
            {isUserAdminValue && (
              <>
                <NavLinkComponent
                  label="Daftar Latihan Kelompok"
                  path="/admin/daftar-latihan-kelompok"
                  toggle={toggle}
                  leftSection={<IconUsersGroup size="1.25rem" stroke={1.5} />}
                  pathname={pathname}
                />
                <NavLinkComponent
                  label="Daftar Latihan Individu"
                  path="/admin/daftar-latihan-individu"
                  toggle={toggle}
                  leftSection={<IconUsersGroup size="1.25rem" stroke={1.5} />}
                  pathname={pathname}
                />
                <NavLinkComponent
                  label="Ensiklopedi Posisi Pemain"
                  path="/admin/ensiklopedi-posisi-pemain"
                  toggle={toggle}
                  leftSection={<IconUsersGroup size="1.25rem" stroke={1.5} />}
                  pathname={pathname}
                />
                <NavLinkComponent
                  label="Data Asesmen"
                  path="/admin/data-asesmen"
                  toggle={toggle}
                  leftSection={<IconUsersGroup size="1.25rem" stroke={1.5} />}
                  pathname={pathname}
                />
                <NavLinkComponent
                  label="Daftar Paket"
                  path="/admin/daftar-paket"
                  toggle={toggle}
                  leftSection={<IconMoneybag size="1.25rem" stroke={1.5} />}
                  pathname={pathname}
                />
                <NavLinkComponent
                  label="Daftar Transaksi"
                  path="/admin/daftar-transaksi"
                  toggle={toggle}
                  leftSection={<IconReceipt size="1.25rem" stroke={1.5} />}
                  pathname={pathname}
                />
                <NavLinkComponent
                  label="Referral Code / Voucher"
                  path="/admin/referrals"
                  toggle={toggle}
                  leftSection={<IconUsersGroup size="1.25rem" stroke={1.5} />}
                  pathname={pathname}
                />
                <NavLinkComponent
                  label="Daftar Alat Latihan"
                  path="/admin/daftar-alat-latihan"
                  toggle={toggle}
                  leftSection={<IconTool size="1.25rem" stroke={1.5} />}
                  pathname={pathname}
                />
                <div>
                  <p className="p-2 text-xs text-gray-500">Admin</p>
                  <NavLinkComponent
                    label="User"
                    path="/admin/user"
                    toggle={toggle}
                    leftSection={<IconTool size="1.25rem" stroke={1.5} />}
                    pathname={pathname}
                  />
                </div>
              </>
            )}
            {/* END OF ADMIN MENU */}

            <div className="absolute left-0 top-0 -z-10 h-full w-full overflow-hidden">
              <div className="relative flex h-full w-full flex-col justify-center">
                <Image
                  src={"/logo-tanpa-teks.png"}
                  alt=""
                  width={500}
                  height={500}
                  className="z-0 h-full w-full -translate-x-1/2 transform opacity-25"
                  style={{ objectFit: "contain" }}
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
