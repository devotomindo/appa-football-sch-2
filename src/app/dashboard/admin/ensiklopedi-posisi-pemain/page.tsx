import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { EnsiklopediPosisiPemainView } from "@/features/ensiklopedi-posisi-pemain/components/view/ensiklopedi-posisi-pemain-view";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default function EnsiklopediPosisiPemain() {
  const queryClient = new QueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardSectionContainer>
        <EnsiklopediPosisiPemainView />
      </DashboardSectionContainer>
    </HydrationBoundary>
  );
}
