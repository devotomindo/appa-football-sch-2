import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { getAssessmentByIdQueryOptions } from "@/features/data-asesmen/actions/get-assesment-by-id/query-options";
import { CreateOrUpdateAsesmenForm } from "@/features/data-asesmen/components/form/create-or-update-asesmen-form";
import { Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Link from "next/link";

export default async function EditAsesmen({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(getAssessmentByIdQueryOptions(id));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardSectionContainer>
        <Link href={"/dashboard/admin/data-asesmen"}>
          <Button
            className="flex w-32 flex-row items-center justify-center capitalize hover:bg-gray-600"
            leftSection={<IconArrowLeft size={18} />}
          >
            back to data asesmen
          </Button>
        </Link>
        <h1 className="my-8 text-2xl font-bold capitalize">
          edit data asesmen
        </h1>
        <CreateOrUpdateAsesmenForm state="edit" id={id} />
      </DashboardSectionContainer>
    </HydrationBoundary>
  );
}
