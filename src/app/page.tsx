import LandingPageAppshell from "@/components/appshell/landing-page-appshell";
import { Slideshow } from "@/features/slideshow/component/Slideshow";

export default function Login() {
  return (
    <LandingPageAppshell>
      {/* start of image slideshow */}
      <section>
        <Slideshow />
      </section>
      {/* end of image slideshow */}
    </LandingPageAppshell>
  );
}
