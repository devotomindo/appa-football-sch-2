import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { createDrizzleConnection } from "@/db/drizzle/connection";
import {
  formationPositioning,
  formations,
  positions,
} from "@/db/drizzle/schema";
import { DetailEnsiklopediPosisiPemainView } from "@/features/ensiklopedi-posisi-pemain/components/view/detail-ensiklopedi-posisi-pemain/detail-ensiklopedi-posisi-pemain-view";
import { eq } from "drizzle-orm";

export default async function DetailEnsiklopediPosisiPemain({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const db = createDrizzleConnection();

  const data = await db
    .select()
    .from(formationPositioning)
    .where(eq(formationPositioning.formationId, id))
    .innerJoin(positions, eq(formationPositioning.positionId, positions.id))
    .innerJoin(formations, eq(formationPositioning.formationId, id));

  const formatedData = {
    namaFormasi: data[0].formations.name ?? "",
    gambarFormasiDefault: data[0].formations.defaultFormationImagePath ?? "",
    gambarOffense: data[0].formations.offenseTransitionImagePath ?? "",
    gambarDefense: data[0].formations.defenseTransitionImagePath ?? "",
    deskripsiFormasi: data[0].formations.description ?? "",
    daftarPosisi: data
      .map((item) => {
        return {
          idPosisi: item.positions.id,
          namaPosisi: item.positions.name,
          karakteristik: item.formation_positioning.characteristics,
          deskripsiOffense: item.formation_positioning.offenseDescription,
          gambarOffense: item.formation_positioning.offenseIllustrationPath,
          deskripsiDefense: item.formation_positioning.defenseDescription,
          gambarDefense: item.formation_positioning.defenseIllustrationPath,
          nomorPosisi: item.formation_positioning.positionNumber,
        };
      })
      .sort((a, b) => a.nomorPosisi - b.nomorPosisi),
  };

  return (
    <DashboardSectionContainer>
      <DetailEnsiklopediPosisiPemainView data={formatedData} />
    </DashboardSectionContainer>
  );
}
