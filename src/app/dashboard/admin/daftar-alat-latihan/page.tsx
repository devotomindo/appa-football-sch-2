import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { DaftarAlatLatihanView } from "@/features/daftar-alat-latihan/components/view/daftar-alat-latihan-view";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default function DaftarLatihanIndividu() {
  const queryClient = new QueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardSectionContainer>
        <DaftarAlatLatihanView />
      </DashboardSectionContainer>
    </HydrationBoundary>
  );
}
