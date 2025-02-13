import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { GetAllPositionsQueryOptions } from "@/features-data/positions/actions/get-all-positions/query-options";
import { GetAllCountriesQueryOptions } from "@/features/data-asesmen/actions/get-all-countries/query-options";
import { getProPlayerByIdQueryOptions } from "@/features/data-asesmen/actions/get-pro-player-by-id/query-options";
import { TambahPemainProForm } from "@/features/data-asesmen/components/form/tambah-pemain-pro-form/tambah-pemain-pro-form";
import { Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Link from "next/link";

export default async function EditPemainPro({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await Promise.allSettled([
    queryClient.prefetchQuery(getProPlayerByIdQueryOptions(id)),
    queryClient.prefetchQuery(GetAllPositionsQueryOptions()),
    queryClient.prefetchQuery(GetAllCountriesQueryOptions()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardSectionContainer>
        <Link href={`/dashboard/admin/data-asesmen/detail-pemain-pro/${id}`}>
          <Button
            className="flex w-32 flex-row items-center justify-center capitalize hover:bg-gray-600"
            leftSection={<IconArrowLeft size={18} />}
          >
            back to data pemain
          </Button>
        </Link>
        <h1 className="my-8 text-2xl font-bold capitalize">edit data pemain</h1>
        <TambahPemainProForm id={id} state="edit" />
      </DashboardSectionContainer>
    </HydrationBoundary>
  );
}
