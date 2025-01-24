import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { EditLatihanKelompokView } from "@/features/daftar-latihan-kelompok/components/view/edit-latihan-kelompok-view";

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
      <EditLatihanKelompokView latihanId={id} />
    </DashboardSectionContainer>
  );
}
