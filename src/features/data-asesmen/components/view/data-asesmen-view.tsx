"use client";

import { Carousel } from "@mantine/carousel";
import { Button } from "@mantine/core";
import { IconNotes } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

export function Kotak({ id }: { id: number }) {
  return (
    <Link href={`/dashboard/admin/data-asesmen/detail-pemain-pro/${id}`}>
      <div className="relative h-72 w-60 rounded-xl border-2 shadow-xl">
        {/* image */}
        <div className="h-3/4 w-full">
          <div className="relative flex h-full w-full items-center justify-center">
            <Image
              src={"/messi.png"}
              alt=""
              width={500}
              height={500}
              className="h-2/3 w-1/2 rounded-2xl object-cover shadow-xl"
            />
          </div>
        </div>
        {/* text */}
        <div className="flex h-1/4 w-full flex-col justify-center rounded-bl-xl rounded-br-xl bg-[#333333] px-4 text-white">
          <div className="flex justify-between">
            <p className="text-sm font-bold capitalize">lionel messi</p>
            <p className="text-sm uppercase">cf</p>
          </div>
          <p className="text-xs font-thin capitalize">argentina - fc dallas</p>
        </div>
      </div>
    </Link>
  );
}

export function DataAsesmenView() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold capitalize">
          data hasil asesmen pemain pro
        </h1>
        <Link href={"/dashboard/admin/data-asesmen/tambah/pemain-pro"}>
          <Button className="!h-12 !w-80 !rounded-lg !bg-green-500 capitalize text-white hover:!bg-green-600 focus-visible:outline-2">
            tambahkan data
          </Button>
        </Link>
      </div>
      <div className="">
        <Carousel
          withIndicators
          withControls
          height={300}
          slideSize={{ base: "100%", sm: "50%", md: "20%" }}
          slideGap={{ base: 0, sm: "md" }}
          align="start"
          slidesToScroll={1}
          loop
          styles={{
            control: {
              '[dataInactive="true"]': {
                opacity: 0,
                cursor: "default",
              },
              position: "static",
              background: "#F0F0F0",
              border: "1px solid #e9ecef",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
              width: "2rem",
              height: "2rem",
            },
            controls: {
              position: "relative",
              width: "100%",
              marginTop: 20,
              display: "flex",
              justifyContent: "center",
              gap: "2rem",
            },
          }}
        >
          {[...Array(8)].map((_, i) => (
            <Carousel.Slide key={i}>
              <Kotak id={i + 1} />
            </Carousel.Slide>
          ))}
        </Carousel>
      </div>

      <div className="flex justify-between">
        <h1 className="text-2xl font-bold capitalize">data asesmen</h1>
        <Link href={"/dashboard/admin/data-asesmen/tambah-asesmen"}>
          <Button className="!h-12 !w-96 !rounded-lg !bg-green-500 capitalize text-white hover:!bg-green-600 focus-visible:outline-2">
            tambahkan data asesmen baru
          </Button>
        </Link>
      </div>

      <div className="px-4">
        {[...Array(5)].map((_, i) => (
          <Link
            href={`/dashboard/admin/data-asesmen/detail-asesmen/${i + 1}`}
            key={i}
          >
            <div className="my-8 flex items-center gap-4 border-b-2 border-[#333333] pb-2">
              <IconNotes />
              <p className="uppercase">push up 1 menit - fisik</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
