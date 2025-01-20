import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { DaftarLatihanIndividuView } from "@/features/daftar-latihan-individu/components/view/daftar-latihan-individu-view";
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
        <DaftarLatihanIndividuView />
      </DashboardSectionContainer>
    </HydrationBoundary>
  );
}
