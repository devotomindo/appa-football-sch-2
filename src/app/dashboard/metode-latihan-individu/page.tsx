import { DaftarLatihanIndividuView } from "@/features/daftar-latihan-individu/components/view/daftar-latihan-individu-view";

export default async function MetodeLatihanIndividu() {
  return <DaftarLatihanIndividuView isAdmin={false} />;
}
