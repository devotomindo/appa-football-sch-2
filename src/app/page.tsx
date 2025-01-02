import LandingPageAppshell from "@/components/appshell/landing-page-appshell";
import { Slideshow } from "@/features/slideshow/component/Slideshow";
import Image from "next/image";

export default function Login() {
  return (
    <LandingPageAppshell>
      {/* start of image slideshow */}
      <section>
        <Slideshow />
      </section>
      {/* end of image slideshow */}

      {/* start of first big header */}
      <section className="bg-[#111111]">
        <div className="flex flex-row items-start gap-8 px-8 py-10">
          <div className="flex h-[700px] flex-1 items-center justify-center">
            <div className="h-full pt-10">
              <Image
                src="/logo.png"
                alt="logo"
                width={400}
                height={400}
                className=""
              />
            </div>
          </div>
          <div className="flex h-[700px] flex-1 flex-col justify-between text-white">
            <div className="flex h-full w-[90%] flex-col justify-between">
              <h1 className="w-3/4 text-[52px] font-black uppercase">
                appa football school
              </h1>
              <p className="w-3/4">
                Merupakan sekolah sepak bola yang menggabungkan pelatihan
                sepakbola tradisional dengan teknologi canggih untuk
                meningkatkan keterampilan dan performa pemain. Siswa dapat
                memanfaatkan berbagai alat canggih yang biasa digunakan di
                akademi sepak bola modern untuk mendapatkan wawasan mendalam
                tentang teknik bermain mereka.
              </p>
              <p className="w-3/4">
                APPA Football School juga menyediakan program pelatihan yang
                disesuaikan dengan kebutuhan individu setiap pemain. Dengan
                pendekatan ini, pemain dapat mengembangkan keterampilan khusus
                yang dibutuhkan untuk posisi mereka dan meningkatkan kekuatan
                serta kelemahan mereka dengan lebih efisien.
              </p>
              <p className="w-3/4">
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
    </LandingPageAppshell>
  );
}
