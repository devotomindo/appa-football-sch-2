import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { createDrizzleConnection } from "@/db/drizzle/connection";
import { trainingProcedure } from "@/db/drizzle/schema";
import { DetailLatihanKelompokView } from "@/features/daftar-latihan-kelompok/components/view/detail-latihan-kelompok/detail-latihan-kelompok-view";
import { eq } from "drizzle-orm";

export default async function DetailLatihanKelompok({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id } = await params;

  const db = createDrizzleConnection();

  const data = await db
    .select()
    .from(trainingProcedure)
    .where(eq(trainingProcedure.id, id));

  return (
    <DashboardSectionContainer>
      <DetailLatihanKelompokView data={data[0]} />
    </DashboardSectionContainer>
  );
}
