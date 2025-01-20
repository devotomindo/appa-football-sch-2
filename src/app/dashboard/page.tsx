import { DashboardView } from "@/features/dashboard/view/dashboard-view";
import { authGuard } from "@/features/user/guards/auth-guard";
import { getSchoolSession } from "@/lib/session";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  // AUTH GUARD
  const authResponse = await authGuard();

  if (!authResponse.success || !authResponse.data) {
    return redirect("/");
  }

  const userData = authResponse.data;
  // END OF AUTH GUARD

  const schoolSession = await getSchoolSession();

  return (
    <DashboardView userData={userData} initialSchoolSession={schoolSession} />
  );
}
