import { getEnsiklopediByIdQueryOptions } from "@/features/ensiklopedi-posisi-pemain/actions/get-ensiklopedi-by-id/query-options";
import { DetailEnsiklopediPosisiPemainView } from "@/features/ensiklopedi-posisi-pemain/components/view/detail-ensiklopedi-posisi-pemain/detail-ensiklopedi-posisi-pemain-view";
import { authGuard } from "@/features/user/guards/auth-guard";
import { isUserAdmin } from "@/features/user/utils/is-user-admin";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default async function DetailEnsiklopediById({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const authResponse = await authGuard();

  if (!authResponse.success || !authResponse.data) {
    return redirect("/");
  }

  const userData = authResponse.data;

  const isAdmin = isUserAdmin(userData);

  const queryClient = new QueryClient();

  await Promise.allSettled([
    queryClient.prefetchQuery(getEnsiklopediByIdQueryOptions(id)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DetailEnsiklopediPosisiPemainView id={id} isAdmin={isAdmin} />
    </HydrationBoundary>
  );
}
