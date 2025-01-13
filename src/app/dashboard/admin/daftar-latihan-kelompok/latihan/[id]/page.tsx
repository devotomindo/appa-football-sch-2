import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import LatihanView from "@/features/daftar-latihan-kelompok/components/view/latihan-view";

export default function Latihan({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id } = params;

  return (
    <DashboardSectionContainer>
      <LatihanView />
    </DashboardSectionContainer>
  );
}
