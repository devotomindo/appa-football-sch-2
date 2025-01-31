"use client";

import { getAssessmentByIdQueryOptions } from "@/features/data-asesmen/actions/get-assesment-by-id/query-options";
import { Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

export function DetailAsesmenView({ id }: { id: string }) {
  const { data: assessmentData } = useQuery(getAssessmentByIdQueryOptions(id));

  return (
    <div>
      <Link href={"/dashboard/admin/data-asesmen"}>
        <Button
          className="flex w-32 flex-row items-center justify-center bg-indigo-500 capitalize hover:bg-indigo-600 focus-visible:outline-2"
          leftSection={<IconArrowLeft size={18} />}
        >
          back to data asesmen
        </Button>
      </Link>
      <div className="mt-5 space-y-2">
        <h1 className="text-2xl font-bold uppercase">{assessmentData?.name}</h1>
        <p className="text-xl uppercase text-[#E92222]">
          {assessmentData?.categoryName}
        </p>
      </div>
      <p className="font-light text-[#333333]">{assessmentData?.description}</p>
      <h2 className="mt-5 text-xl font-bold capitalize">tujuan asesmen</h2>
      <p className="font-extralight">{assessmentData?.mainGoal}</p>
      <div className="mt-5 space-y-4">
        {assessmentData?.illustrations?.map((illustration, i) => (
          <div className="rounded-xl border-2 shadow-xl" key={i}>
            <div className="flex items-start gap-10 p-6">
              <div className="relative h-40 w-64 overflow-hidden rounded-xl border-2 shadow-xl">
                <Image
                  src={illustration.imageUrl || "/push-up.png"}
                  alt={`Step ${i + 1}`}
                  width={500}
                  height={500}
                  className="h-full w-full rounded-xl object-cover shadow-xl"
                />
              </div>

              <div className="space-y-2">
                <p className="text-xl font-bold capitalize">langkah #{i + 1}</p>
                <p className="font-extralight">{illustration.procedure}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
