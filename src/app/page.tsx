import LandingPageAppshell from "@/components/appshell/landing-page-appshell";
import { Slideshow } from "@/features/slideshow/component/Slideshow";
import TestimoniCarousel from "@/features/slideshow/component/TestimoniCarousel";
import { AspectRatio } from "@mantine/core";
import {
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import Image from "next/image";

const fasilitasData = [
  {
    image: "/fasilitas-1.png",
    title: "Pelatih Berlisensi PSSI",
    description:
      "Our data-driven analytics provide an in-depth look at every play, allowing you to quickly assess, monitor, and improve performance.",
  },
  {
    image: "/amorim.jpg",
    title: "rapor individu",
    description:
      "Our data-driven analytics provide an in-depth look at every play, allowing you to quickly assess, monitor, and improve performance.",
  },
  {
    image: "/mo salah.jpeg",
    title: "sport technology",
    description:
      "Our data-driven analytics provide an in-depth look at every play, allowing you to quickly assess, monitor, and improve performance.",
  },
  {
    image: "/bruno.jpg",
    title: "kompetisi rutin",
    description:
      "Our data-driven analytics provide an in-depth look at every play, allowing you to quickly assess, monitor, and improve performance.",
  },
  {
    image: "/ronaldo.jpeg",
    title: "training ground",
    description:
      "Our data-driven analytics provide an in-depth look at every play, allowing you to quickly assess, monitor, and improve performance.",
  },
];

export default function LandingPage() {
  return (
    <LandingPageAppshell>
      {/* start of image slideshow */}
      <section className="max-md:hidden">
        <Slideshow />
      </section>
      {/* end of image slideshow */}

      {/* start of first big header */}
      <section id="Home" className="relative overflow-hidden bg-[#111111]">
        <div className="relative z-10 flex flex-row items-start gap-20 px-8 py-20 leading-loose max-lg:flex-col max-lg:px-14">
          <div className="flex h-full w-full flex-1 items-center justify-center lg:pt-8">
            <div className="">
              <Image
                src="/logo.png"
                alt="logo"
                width={500}
                height={400}
                className=""
              />
            </div>
          </div>
          <div className="relative z-10 flex flex-1 flex-col justify-between text-white">
            <div className="flex h-full flex-col justify-between gap-10">
              <h1 className="text-[52px] font-black uppercase max-lg:text-center xl:w-[90%]">
                appa football school
              </h1>
              <p className="text-justify font-extralight xl:w-3/4">
                Merupakan sekolah sepak bola yang menggabungkan pelatihan
                sepakbola tradisional dengan teknologi canggih untuk
                meningkatkan keterampilan dan performa pemain. Siswa dapat
                memanfaatkan berbagai alat canggih yang biasa digunakan di
                akademi sepak bola modern untuk mendapatkan wawasan mendalam
                tentang teknik bermain mereka.
              </p>
              <p className="text-justify font-extralight xl:w-3/4">
                <span className="text-left font-bold">
                  APPA Football School
                </span>{" "}
                juga menyediakan program pelatihan yang disesuaikan dengan
                kebutuhan individu setiap pemain. Dengan pendekatan ini, pemain
                dapat mengembangkan keterampilan khusus yang dibutuhkan untuk
                posisi mereka dan meningkatkan kekuatan serta kelemahan mereka
                dengan lebih efisien.
              </p>
              <p className="text-justify font-extralight xl:w-3/4">
                Kombinasi dari metode pelatihan tradisional dengan inovasi
                teknologi membuat APPA Football School menjadi tempat yang ideal
                bagi pemain yang ingin mencapai potensi maksimal mereka dan
                bersaing di tingkat tertinggi dalam dunia sepakbola.
              </p>
            </div>
          </div>
        </div>
        <div className="bulat-2 absolute -top-52 z-0 h-[500px] w-[500px] rounded-full sm:right-[5%] xl:right-[5%]"></div>
        <div className="bulat absolute -bottom-52 z-0 h-[500px] w-[500px] rounded-full lg:left-[5%] 2xl:left-[20%]"></div>
      </section>
      {/* end of first big header */}

      {/* start of fasilitas section */}
      <section id="Fasilitas" className="space-y-28 px-8 py-28 md:px-20">
        <h1 className="text-center text-4xl font-black uppercase tracking-[.25em]">
          fasilitas
        </h1>
        <div className="grid grid-cols-1 gap-10 drop-shadow-2xl sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {fasilitasData.map((data, index) => {
            return (
              <div
                key={index}
                className="flex flex-col items-center space-y-8 text-center"
              >
                <div className="relative h-[500px]">
                  <Image
                    src={data.image}
                    alt=""
                    width={350}
                    height={650}
                    className="size-full rounded-2xl object-cover shadow-xl"
                  />
                </div>
                <div className="w-full space-y-4 px-4">
                  <p className="h-[56px] text-xl font-bold capitalize">
                    {data.title}
                  </p>
                  <p className="text-base font-extralight capitalize">
                    {data.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {/* end of fasilitas section */}

      {/* start of testimoni section */}
      <section className="relative space-y-10 overflow-hidden bg-[#111111] py-20 text-white">
        <h1 className="text-center text-4xl font-black uppercase tracking-[.25em]">
          testimoni
        </h1>
        <TestimoniCarousel />
        <div className="absolute right-[-25%] top-0 h-full w-1/2">
          <Image
            src={"/logo.png"}
            alt=""
            fill
            className="opacity-15"
            style={{ objectFit: "contain" }}
          />
        </div>
      </section>
      {/* end of testimoni section */}

      {/* start of footer section */}
      <footer
        id="Kontak"
        className="grid grid-cols-1 gap-8 bg-[#000000] px-8 py-20 text-white md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:items-start"
      >
        <div className="relative flex h-full w-full items-center justify-center md:justify-self-start">
          <div className="relative h-1/2 w-1/2">
            <Image
              src={"/logo.png"}
              alt=""
              width={100}
              height={100}
              className="h-full w-full object-contain"
            />
          </div>
        </div>
        <div className="flex flex-col gap-10">
          <div className="">
            <p className="text-2xl font-black uppercase text-[#bb000e]">
              appa football school
            </p>
            <p className="text-xl font-bold uppercase">kediri</p>
          </div>

          <div className="">
            <p className="capitalize">homebase</p>
            <p className="text-sm font-extralight">
              Lapangan Jongbiru, Desa Jongbiru, Kecamatan Gampengrejo, Kabupaten
              Kediri
            </p>
          </div>
          <div className="">
            <p className="capitalize">maps</p>
            <AspectRatio ratio={16 / 9}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4905.243936192186!2d112.00310237591702!3d-7.787783577284272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7850d4012de11b%3A0x17e7332d77c4aa26!2sLapangan%20Jongbiru!5e1!3m2!1sen!2sid!4v1736155749466!5m2!1sen!2sid"
                title="Google map"
                style={{ border: 0, borderRadius: ".5rem" }}
              />
            </AspectRatio>
          </div>
        </div>

        <div className="mx-auto space-y-4">
          <p className="capitalize">kontak</p>
          <div className="flex flex-row items-center gap-2">
            <IconBrandWhatsapp />
            <p>0855098702022</p>
          </div>
        </div>
        <div className="space-y-4">
          <p className="capitalize">Kunjungi Sosial Media Kami</p>
          <div className="flex flex-row items-center gap-2">
            <IconBrandInstagram />
            <p>@appafootballschool</p>
          </div>
          <div className="flex flex-row items-center gap-2">
            <IconBrandTiktok />
            <p>@appafootball</p>
          </div>
        </div>
      </footer>
      {/* end of footer section */}
    </LandingPageAppshell>
  );
}
