"use client";

import { Carousel } from "@mantine/carousel";
import Image from "next/image";

export const Slideshow = () => {
  return (
    <Carousel
      height={600}
      className="bg-sky-300"
      loop
      withIndicators
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
      </Carousel.Slide>
      <Carousel.Slide className="relative">
        <Image src={"/header-2.jpg"} alt="" fill className="object-cover" />
      </Carousel.Slide>
      <Carousel.Slide className="relative">
        <Image src={"/header-3.jpg"} alt="" fill className="object-cover" />
      </Carousel.Slide>
    </Carousel>
  );
};
