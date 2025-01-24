import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { DetailLatihanKelompokView } from "@/features/daftar-latihan-kelompok/components/view/detail-latihan-kelompok/detail-latihan-kelompok-view";

export default async function DetailLatihanKelompok({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  return (
    <DashboardSectionContainer>
      <DetailLatihanKelompokView latihanId={id} />
    </DashboardSectionContainer>
  );
}
