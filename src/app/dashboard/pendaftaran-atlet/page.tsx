import { PendaftaranAtletView } from "@/features/pendaftaran-atlet/view/pendaftaran-atlet-view";
import { authGuard } from "@/features/user/guards/auth-guard";
import { redirect } from "next/navigation";

export default async function PendaftaranAtletPage() {
  // AUTH GUARD
  const authResponse = await authGuard();

  if (!authResponse.success || !authResponse.data) {
    return redirect("/");
  }

  const userData = authResponse.data;
  // END OF AUTH GUARD

  return (
    <div>
      <PendaftaranAtletView userData={userData} />
    </div>
  );
}
