import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { createDrizzleConnection } from "@/db/drizzle/connection";
import { trainingProcedure } from "@/db/drizzle/schema";
import { DetailLatihanIndividuView } from "@/features/daftar-latihan-individu/components/view/detail-latihan-individu/detail-latihan-individu-view";
import { eq } from "drizzle-orm";

export default async function DetailLatihanIndividu({
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
      <DetailLatihanIndividuView data={data[0]} />
    </DashboardSectionContainer>
  );
}
