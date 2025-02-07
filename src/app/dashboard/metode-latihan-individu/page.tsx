import { DaftarLatihanIndividuView } from "@/features/daftar-latihan-individu/components/view/daftar-latihan-individu-view";

export default async function MetodeLatihanIndividu() {
  // You'll need to implement your own logic to get the student ID
  // This is just an example - replace with your actual auth/session logic
  const studentId = "your-student-id-logic-here";

  return <DaftarLatihanIndividuView isAdmin={false} studentId={studentId} />;
}
