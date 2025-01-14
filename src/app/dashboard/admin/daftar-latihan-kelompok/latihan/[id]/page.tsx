import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { DetailLatihanKelompokView } from "@/features/daftar-latihan-kelompok/components/view/detail-latihan-kelompok/detail-latihan-kelompok-view";

export default async function DetailLatihanKelompok({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id } = params;

  return (
    <DashboardSectionContainer>
      <DetailLatihanKelompokView />
    </DashboardSectionContainer>
  );
}
