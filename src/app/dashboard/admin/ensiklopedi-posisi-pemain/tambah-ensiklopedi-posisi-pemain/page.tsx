import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { GetAllPositionsQueryOptions } from "@/features-data/positions/actions/get-all-positions/query-options";
import { EnsiklopediPosisiPemainForm } from "@/features/ensiklopedi-posisi-pemain/components/form/ensiklopedi-posisi-pemain-form";
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

export default async function TambahEnsiklopediPosisiPemain() {
  const authResponse = await authGuard();

  if (!authResponse.success || !authResponse.data) {
    return redirect("/");
  }

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(GetAllPositionsQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardSectionContainer>
        <Link href={"/dashboard/admin/ensiklopedi-posisi-pemain"}>
          <Button
            className="flex w-32 flex-row items-center justify-center bg-indigo-500 capitalize hover:bg-indigo-600 focus-visible:outline-2"
            leftSection={<IconArrowLeft size={18} />}
          >
            back to ensiklopedi posisi pemain
          </Button>
        </Link>
        <h1 className="my-8 text-2xl font-semibold capitalize">formasi baru</h1>
        <EnsiklopediPosisiPemainForm />
      </DashboardSectionContainer>
    </HydrationBoundary>
  );
}
