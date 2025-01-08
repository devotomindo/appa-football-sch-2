import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { AsesmenPemainView } from "@/features/assesmen-pemain/components/view/assesmen-pemain-view";
import Image from "next/image";

export default function AsesmenPemain() {
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

      <AsesmenPemainView />
    </DashboardSectionContainer>
  );
}
