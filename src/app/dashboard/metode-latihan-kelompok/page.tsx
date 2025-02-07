import { DaftarLatihanKelompokView } from "@/features/daftar-latihan-kelompok/components/view/daftar-latihan-kelompok-view";
import { authGuard } from "@/features/user/guards/auth-guard";
import { redirect } from "next/navigation";

export default async function MetodeLatihanKelompok() {
  const authResponse = await authGuard();

  if (authResponse.data?.schools[0].role.toLowerCase() === "athlete") {
    redirect("/dashboard/metode-latihan-individu");
  }

  return <DaftarLatihanKelompokView isAdmin={false} />;
}
