"use client";

import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { HasilAsesmenPemainTable } from "../table/hasil-asesmen-pemain-table";

export function HasilAsesmenPemainView() {
  return (
    <DashboardSectionContainer>
      <h1 className="text-xl font-semibold">Hasil Asesmen Pemain</h1>

      <div>
        <HasilAsesmenPemainTable />
      </div>
    </DashboardSectionContainer>
  );
}
