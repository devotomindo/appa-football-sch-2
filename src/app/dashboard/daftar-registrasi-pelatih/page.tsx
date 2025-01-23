import { DaftarRegistrasiPelatihView } from "@/features/daftar-registrasi-pelatih/view/daftar-registrasi-pelatih-view";
import { authGuard } from "@/features/user/guards/auth-guard";
import { getSchoolSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DaftarRegistrasiPemainPage() {
  // AUTH GUARD
  const authResponse = await authGuard();

  if (!authResponse.success || !authResponse.data) {
    return redirect("/");
  }

  const userData = authResponse.data;
  // END OF AUTH GUARD

  const schoolSession = await getSchoolSession();

  return (
    <DaftarRegistrasiPelatihView
      userData={userData}
      initialSchoolSession={schoolSession}
    />
  );
}
