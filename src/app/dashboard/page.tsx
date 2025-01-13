import { BlackBackgroundContainer } from "@/components/container/black-backgorund-container";
import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { authGuard } from "@/features/user/guards/auth-guard";
import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  // AUTH GUARD
  const authResponse = await authGuard();

  if (!authResponse.success || !authResponse.data) {
    return redirect("/");
  }
  // END OF AUTH GUARD

  console.log(authResponse.data);
  console.log(authResponse.data.userRole[0].id);

  return (
    <DashboardSectionContainer>
      {authResponse.data.userRole[0].id === 2 ? (
        <div>
          <div className="">
            <div className="flex items-center justify-between rounded-xl bg-black p-4 uppercase text-white shadow-lg">
              <p>statistik pengguna</p>
              <p>total omzet: 330.000.000</p>
            </div>
          </div>
          <div className="rounded-xl p-4 uppercase shadow-lg">
            <p>regional pengguna</p>
          </div>
        </div>
      ) : (
        <>
          <div
            className="flex flex-col items-center gap-6 rounded-xl p-4 shadow-lg md:flex-row md:items-start md:gap-10 md:p-8"
            id="banner"
          >
            <div className="relative h-full">
              <Image
                src={"/garuda-mas.png"}
                alt=""
                width={80}
                height={80}
                className="md:w-[100px]"
              />
            </div>
            <div className="space-y-4 text-center md:text-left">
              <p className="text-xl font-bold md:text-2xl">SSB GARUDA MAS</p>
              <div className="">
                <p>
                  Jl. Lidah Wetan, Kec. Lakarsantri, Surabaya, Jawa Timur 60213
                </p>
                <p>0812-3456-4834</p>
              </div>
              <p className="font-bold">Lapangan Kodam Brawijaya, Surabaya</p>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4">
            <BlackBackgroundContainer>
              <p className="relative z-10 text-8xl font-bold max-sm:text-7xl">
                5
              </p>
              <p className="relative z-10 font-bold capitalize">
                total pelatih
              </p>
            </BlackBackgroundContainer>
            <BlackBackgroundContainer>
              <p className="relative z-10 text-8xl font-bold max-sm:text-7xl">
                60
              </p>
              <p className="relative z-10 font-bold capitalize">pemain ku-8</p>
            </BlackBackgroundContainer>
            <BlackBackgroundContainer>
              <p className="relative z-10 text-8xl font-bold max-sm:text-7xl">
                40
              </p>
              <p className="relative z-10 font-bold capitalize">pemain ku-10</p>
            </BlackBackgroundContainer>
            <BlackBackgroundContainer>
              <p className="relative z-10 text-8xl font-bold max-sm:text-7xl">
                35
              </p>
              <p className="relative z-10 font-bold capitalize">pemain ku-13</p>
            </BlackBackgroundContainer>
            <BlackBackgroundContainer>
              <p className="relative z-10 text-8xl font-bold max-sm:text-7xl">
                30
              </p>
              <p className="relative z-10 font-bold capitalize">pemain ku-15</p>
            </BlackBackgroundContainer>
            <BlackBackgroundContainer>
              <p className="relative z-10 text-8xl font-bold max-sm:text-7xl">
                35
              </p>
              <p className="relative z-10 font-bold capitalize">pemain ku-17</p>
            </BlackBackgroundContainer>
          </div>
        </>
      )}
    </DashboardSectionContainer>
  );
}
