"use client";

import { Carousel } from "@mantine/carousel";
import { IconQuoteFilled } from "@tabler/icons-react";
import Image from "next/image";

export default function TestimoniCarousel() {
  return (
    <Carousel
      //   height={400}
      className="relative text-center"
      loop
      styles={{
        controls: {
          position: "absolute",
          //   bottom: "5%",
          top: "unset",
          width: "180px", // constrain width to bring controls closer
          left: "50%",
          transform: "translateX(-50%)", // center the controls
          display: "flex",
          justifyContent: "space-between",
        },
        indicators: {
          bottom: "25px",
          width: "auto",
          left: "50%",
          transform: "translateX(-50%)",
        },
      }}
      withIndicators={false}
    >
      {[...Array(3)].map((_, index) => {
        return (
          <Carousel.Slide className="space-y-10" key={index}>
            <IconQuoteFilled size={150} className="mx-auto text-[#bb000e]" />
            <div className="mx-auto w-1/3 space-y-4">
              <p className="">
                Our data-driven analytics provide an in-depth look at every
                play, allowing you to quickly assess, monitor, and improve
                performance.
              </p>
              <p>Gwen Soni, Wali Murid APPA Football School</p>
            </div>

            <Image
              src={"/logo.png"}
              alt=""
              width={50}
              height={50}
              className="mx-auto"
            />
          </Carousel.Slide>
        );
      })}
    </Carousel>
  );
}
