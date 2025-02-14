import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { DaftarTransaksiView } from "@/features/transactions/components/view/daftar-transaksi-view";

export default function DaftarTransaksiPage() {
  return (
    <DashboardSectionContainer>
      <h1 className="text-xl font-bold">Daftar Transaksi</h1>
      <DaftarTransaksiView />
    </DashboardSectionContainer>
  );
}
