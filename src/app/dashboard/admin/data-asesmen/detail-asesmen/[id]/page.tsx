import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { DetailAsesmenView } from "@/features/data-asesmen/components/view/detail-asesmen-view/detail-asesmen-view";

export default async function DetailAsesmen({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  console.log(id);

  return (
    <DashboardSectionContainer>
      <DetailAsesmenView />
    </DashboardSectionContainer>
  );
}
