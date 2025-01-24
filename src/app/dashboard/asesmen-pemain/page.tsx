import { AsesmenPemainView } from "@/features/assesmen-pemain/components/view/assesmen-pemain-view";
import { getSchoolSession } from "@/lib/session";

export default async function AsesmenPemain() {
  // AUTH GUARD
  // const authResponse = await authGuard();

  // if (!authResponse.success || !authResponse.data) {
  //   return redirect("/");
  // }

  // const userData = authResponse.data;
  // END OF AUTH GUARD

  const schoolSession = await getSchoolSession();

  return <AsesmenPemainView initialSchoolSession={schoolSession} />;
}
