import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { getEnsiklopediByIdQueryOptions } from "@/features/ensiklopedi-posisi-pemain/actions/get-ensiklopedi-by-id/query-options";
import EditEnsiklopediPemainView from "@/features/ensiklopedi-posisi-pemain/components/view/edit-ensiklopedi-pemain-view/edit-ensiklopedi-pemain-view";
import { authGuard } from "@/features/user/guards/auth-guard";
import { Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function EditEnsiklopediPemain({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const authResponse = await authGuard();

  if (!authResponse.success || !authResponse.data) {
    return redirect("/");
  }

  const queryClient = new QueryClient();

  await Promise.allSettled([
    queryClient.prefetchQuery(getEnsiklopediByIdQueryOptions(id)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardSectionContainer className="space-y-8">
        <Link
          href={`/dashboard/admin/ensiklopedi-posisi-pemain/detail-ensiklopedi-posisi-pemain/${id}`}
        >
          <Button
            className="flex w-32 flex-row items-center justify-center bg-indigo-500 capitalize hover:bg-indigo-600 focus-visible:outline-2"
            leftSection={<IconArrowLeft size={18} />}
          >
            back to detail ensiklopedi posisi pemain
          </Button>
        </Link>
        <EditEnsiklopediPemainView id={id} />
      </DashboardSectionContainer>
    </HydrationBoundary>
  );
}
