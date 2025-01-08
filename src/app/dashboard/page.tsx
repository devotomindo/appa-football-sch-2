import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import MemberCountContainer from "@/components/container/member-count-container";
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

  return (
    <DashboardSectionContainer>
      <div className="flex flex-row items-center gap-10 rounded-xl p-8 shadow-lg">
        <div className="relative h-full">
          <Image src={"/garuda-mas.png"} alt="" width={100} height={100} />
        </div>
        <div className="space-y-4">
          <p className="text-2xl font-bold">SSB GARUDA MAS</p>
          <div className="">
            <p>Jl. Lidah Wetan, Kec. Lakarsantri, Surabaya, Jawa Timur 60213</p>
            <p>0812-3456-4834</p>
          </div>
          <p className="font-bold">Lapangan Kodam Brawijaya, Surabaya</p>
        </div>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4">
        <MemberCountContainer>
          <p className="text-8xl font-bold">5</p>
          <p className="relative z-10 font-bold capitalize">total pelatih</p>
        </MemberCountContainer>
        {/* <MemberCountContainer number={5} category="total pelatih" />
        <MemberCountContainer number={60} category="pemain ku-8" />
        <MemberCountContainer number={40} category="pemain ku-10" />
        <MemberCountContainer number={35} category="pemain ku-13" />
        <MemberCountContainer number={30} category="pemain ku-15" />
        <MemberCountContainer number={35} category="pemain ku-17" /> */}
      </div>
    </DashboardSectionContainer>
  );
}
