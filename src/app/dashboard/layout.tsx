import { DashboardAppshell } from "@/components/appshell/dashboard-appshell";
import { authGuard } from "@/features/user/guards/auth-guard";
import { getSchoolSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authResponse = await authGuard();

  if (!authResponse.success || !authResponse.data) {
    return redirect("/");
  }

  const userData = authResponse.data;
  const schoolSession = await getSchoolSession();

  return (
    <DashboardAppshell userData={userData} initialSchool={schoolSession}>
      {children}
    </DashboardAppshell>
  );
}
