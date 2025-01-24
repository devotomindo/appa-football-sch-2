import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { EditLatihanIndividuView } from "@/features/daftar-latihan-individu/components/view/edit-latihan-individu-view";

export default async function EditLatihanKelompok({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  return (
    <DashboardSectionContainer>
      <EditLatihanIndividuView latihanId={id} />
    </DashboardSectionContainer>
  );
}
