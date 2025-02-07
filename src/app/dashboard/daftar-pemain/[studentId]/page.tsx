import { BiodataPemainView } from "@/features/daftar-pemain/view/biodata-pemain-view";
import { authGuard } from "@/features/user/guards/auth-guard";
import { getSchoolSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function BiodataPemainPage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  // AUTH GUARD
  const authResponse = await authGuard();

  if (!authResponse.success || !authResponse.data) {
    return redirect("/");
  }

  const userData = authResponse.data;
  // END OF AUTH GUARD

  const schoolSession = await getSchoolSession();

  return (
    <BiodataPemainView
      userData={userData}
      studentId={(await params).studentId}
      initialSchoolSession={schoolSession}
    />
  );
}
