import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { DetailPemainProView } from "@/features/data-asesmen/components/view/detail-pemain-pro-view/detail-pemain-pro-view";

export default async function DetailPemainPro() {
  return (
    <DashboardSectionContainer>
      <DetailPemainProView />
    </DashboardSectionContainer>
  );
}
