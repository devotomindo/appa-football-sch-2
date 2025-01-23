import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { DetailPemainProView } from "@/features/data-asesmen/components/view/detail-pemain-pro-view/detail-pemain-pro-view";

export default async function DetailPemainPro({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <DashboardSectionContainer>
      <DetailPemainProView />
    </DashboardSectionContainer>
  );
}
