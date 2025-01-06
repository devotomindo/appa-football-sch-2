"use client";

import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useRef } from "react";

export const Slideshow = () => {
  const autoplay = useRef(Autoplay({ delay: 2000 }));

  return (
    <Carousel
      height={600}
      className=""
      loop
      withIndicators
      plugins={[autoplay.current]}
      onMouseEnter={autoplay.current.stop}
      onMouseLeave={autoplay.current.reset}
      styles={{
        indicator: {
          backgroundColor: "white",
          width: 10,
          height: 10,
          borderRadius: 5,
          marginInline: 10,
        },
      }}
    >
      <Carousel.Slide className="relative">
        <Image src={"/header-1.jpg"} alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </Carousel.Slide>
      <Carousel.Slide className="relative">
        <Image src={"/header-2.jpg"} alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </Carousel.Slide>
      <Carousel.Slide className="relative">
        <Image src={"/header-3.jpg"} alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </Carousel.Slide>
    </Carousel>
  );
};
