import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { DaftarPaketBuyerView } from "@/features/daftar-paket/components/view/daftar-paket-buyer-view";

export default function DaftarPaketPage() {
  return (
    <DashboardSectionContainer>
      <DaftarPaketBuyerView />
    </DashboardSectionContainer>
  );
}
