import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { DetailLatihanIndividuView } from "@/features/daftar-latihan-individu/components/view/detail-latihan-individu-view";

export default async function DetailLatihanIndividu({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  return (
    <DashboardSectionContainer>
      <DetailLatihanIndividuView latihanId={id} />
    </DashboardSectionContainer>
  );
}
