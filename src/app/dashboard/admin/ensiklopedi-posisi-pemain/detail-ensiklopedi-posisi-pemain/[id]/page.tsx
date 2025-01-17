import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { DetailEnsiklopediPosisiPemainView } from "@/features/ensiklopedi-posisi-pemain/components/view/detail-ensiklopedi-posisi-pemain/detail-ensiklopedi-posisi-pemain-view";

export default async function DetailEnsiklopediPosisiPemain({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  console.log(id);

  return (
    <DashboardSectionContainer>
      <DetailEnsiklopediPosisiPemainView />
    </DashboardSectionContainer>
  );
}
