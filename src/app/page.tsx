import LandingPageAppshell from "@/components/appshell/landing-page-appshell";
import { Slideshow } from "@/features/slideshow/component/Slideshow";
import TestimoniCarousel from "@/features/slideshow/component/TestimoniCarousel";
import {
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  return (
    <LandingPageAppshell>
      {/* start of image slideshow */}
      <section className="max-md:hidden">
        <Slideshow />
      </section>
      {/* end of image slideshow */}

      {/* start of first big header */}
      <section className="bg-[#111111]">
        <div className="flex flex-row items-start gap-20 px-8 py-20 leading-loose max-lg:flex-col max-lg:px-14">
          <div className="flex h-full w-full flex-1 items-center justify-center lg:pt-8">
            <div className="h-full">
              <Image
                src="/logo.png"
                alt="logo"
                width={400}
                height={400}
                className=""
              />
            </div>
          </div>
          {/* <div className="relative h-full w-full">
            <Image src="/logo.png" alt="logo" fill className="object-contain" />
          </div> */}
          <div className="flex flex-1 flex-col justify-between text-white">
            <div className="flex h-full flex-col justify-between gap-10">
              <h1 className="text-center text-[52px] font-black uppercase lg:text-justify xl:w-[90%]">
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
      </section>
      {/* end of first big header */}

      {/* start of program latihan section */}
      <section className="space-y-28 bg-[#bb000e] px-8 py-28 text-white md:px-20">
        <h1 className="text-center text-4xl font-black uppercase">
          program latihan
        </h1>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {[...Array(5)].map((_, index) => {
            return (
              <div
                className="flex flex-col items-center gap-10 rounded-3xl bg-black px-2 pb-32 pt-2 text-center"
                key={index}
              >
                <Image
                  src={"/banner-alt-1.png"}
                  alt=""
                  width={"350"}
                  height={"350"}
                  className="w-full"
                />
                <div className="space-y-2">
                  <p className="text-xl font-bold uppercase text-[#bb000e]">
                    fun, play & move
                  </p>
                  <p className="font-bold">5 - 8 tahun</p>
                </div>
                <p className="font-light">
                  Pada kelompok ini, pemain dikenalkan tentang sepak bola dengan
                  cara memperbanyak sesi bermain dan menciptakan suasana agar
                  peserta merasa senang
                </p>
                <div className="mt-10 space-y-2 capitalize">
                  <p className="font-bold underline">program</p>
                  <div className="font-light">
                    <p>teknik dasar</p>
                    <p>circuit game</p>
                    <p>4v4 game</p>
                    <p>fair play</p>
                  </div>
                </div>
                <div className="mt-44">
                  <p className="font-light capitalize">sesi berlatih :</p>
                  <p className="font-bold capitalize">
                    minggu 07.00 - 08.30 WIB
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mx-auto w-fit cursor-pointer rounded-full bg-green-700 px-10 py-5 uppercase text-white transition-colors duration-300 ease-in-out hover:bg-green-800">
          daftar trial sekarang
        </div>
      </section>
      {/* end of program latihan section */}

      {/* start of fasilitas section */}
      <section className="space-y-28 px-8 py-28 md:px-20">
        <h1 className="text-center text-4xl font-black uppercase tracking-[.25em]">
          fasilitas
        </h1>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {[...Array(5)].map((_, index) => {
            return (
              <div
                key={index}
                className="flex flex-col items-center space-y-8 text-center"
              >
                <Image
                  src="/fasilitas-1.png"
                  alt=""
                  width={350}
                  height={650}
                  className="w-full rounded-2xl shadow-xl"
                />
                <div className="w-full space-y-4 px-4">
                  <p className="text-xl font-bold capitalize">
                    pelatih berlisensi PSSI
                  </p>
                  <p className="text-base font-extralight capitalize">
                    Our data-driven analytics provide an in-depth look at every
                    play, allowing you to quickly assess, monitor, and improve
                    performance.
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

      {/* start of informasi & berita section */}
      <section className="space-y-32 px-40 py-20">
        <h1 className="text-center text-4xl font-black uppercase tracking-[.25em]">
          informasi & berita
        </h1>
        <div className="flex flex-row justify-between gap-24">
          {[...Array(3)].map((_, index) => {
            return (
              <div className="space-y-5" key={index}>
                <div className="relative aspect-video w-full">
                  <Image
                    src={"/news-1.png"}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
                <p>Asiana Kampiun Piala Soeratin DKI Jakarta U15</p>
                <p className="font-extralight">20 Juli 2024</p>
                <p className="font-extralight">
                  Usai melalui tahapan group, 16 besar, 8 besar dan semifinal
                  akhirnya Asiana berhasil berdiri di babak final. Ini menjadi
                  satu langkah menuju jenjang Piala Soeratin U15 2024 tingkat
                  nasional. Berlangsung di Stadion Madya Gelora Bung Karno,
                  Senayan Jakarta, pada 5 Desember 2024.
                </p>
                <Link href={"/"} className="">
                  selengkapnya{">"}
                  {">"}
                  {">"}
                </Link>
              </div>
            );
          })}
        </div>
      </section>
      {/* end of informasi & berita section */}

      {/* start of footer section */}
      <footer className="flex flex-row items-center justify-between gap-14 bg-[#000000] px-20 py-20 text-white">
        <div className="relative h-[250px] w-[250px]">
          <Image src={"/logo.png"} alt="" fill className="object-contain" />
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
            <p className="text-sm font-extralight">
              https://maps.app.goo.gl/mtyc8S6BK4x8gP4c6
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="capitalize">kontak</p>
          <div className="flex flex-row items-center">
            <IconBrandWhatsapp />
            <p>0855098702022</p>
          </div>
        </div>
        <div className="space-y-4">
          <p className="capitalize">Kunjungi Sosial Media Kami</p>
          <div className="flex flex-row items-center">
            <IconBrandInstagram />
            <p>@appafootballschool</p>
          </div>
          <div className="flex flex-row items-center">
            <IconBrandTiktok />
            <p>@appafootball</p>
          </div>
        </div>
      </footer>
      {/* end of footer section */}
    </LandingPageAppshell>
  );
}
