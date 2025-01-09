import { BlackBackgroundContainer } from "@/components/container/black-backgorund-container";
import { DashboardSectionContainer } from "@/components/container/dashboard-section-container";
import { PesertaAsesmenTable } from "@/features/assesmen-pemain/components/table/peserta-asesmen-table";
import Image from "next/image";

const mekanismeAsesmen = [
  {
    langkah: "langkah pertama",
    deskripsi: "Peserta asesmen bersiap dengan posisi push up",
  },
  {
    langkah: "langkah kedua",
    deskripsi:
      "Peserta asesmen melakukan push up sebanyak-banyaknya dalam waktu 1 menit",
  },
  {
    langkah: "langkah ketiga",
    deskripsi:
      "Penguji menyimpan perolehan jumlah push up yang didapat oleh peserta",
  },
];

export default function AsesmenDetail({
  params,
}: {
  params: { name: string };
}) {
  return (
    <DashboardSectionContainer>
      <p className="font-bold uppercase">asesmen</p>
      <p className="text-5xl uppercase tracking-wider text-[#E92222]">
        {params.name.split("-").join(" ")}
      </p>
      <div className="space-y-4 py-16">
        <p className="text-xl font-bold uppercase">mekanisme asesmen</p>
        <div className="grid grid-cols-3 gap-5">
          {mekanismeAsesmen.map((item, index) => (
            <BlackBackgroundContainer key={index}>
              <div className="relative z-10 grid h-full grid-cols-2 items-center gap-10">
                <div className="h-full w-full">
                  <Image
                    src={"/ball-2.jpg"}
                    alt=""
                    width={500}
                    height={500}
                    className="h-full w-full rounded-xl object-cover"
                  />
                </div>
                <div className="flex h-full flex-col gap-4">
                  <p className="text-xl font-bold uppercase">{item.langkah}</p>
                  <p className="text-lg font-light capitalize">
                    {item.deskripsi}
                  </p>
                </div>
              </div>
            </BlackBackgroundContainer>
          ))}
        </div>
      </div>
      <PesertaAsesmenTable />
    </DashboardSectionContainer>
  );
}
