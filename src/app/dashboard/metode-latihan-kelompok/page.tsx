import { getAllLatihanKelompokQueryOptions } from "@/features/daftar-latihan-kelompok/actions/get-all-latihan-kelompok/query-options";
import { DaftarLatihanKelompokView } from "@/features/daftar-latihan-kelompok/components/view/daftar-latihan-kelompok-view";
import { authGuard } from "@/features/user/guards/auth-guard";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default async function MetodeLatihanKelompok() {
  const authResponse = await authGuard();

  if (authResponse.data?.schools[0].role.toLowerCase() === "athlete") {
    redirect("/dashboard/metode-latihan-individu");
  }

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(getAllLatihanKelompokQueryOptions()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DaftarLatihanKelompokView isAdmin={false} />
    </HydrationBoundary>
  );
}
