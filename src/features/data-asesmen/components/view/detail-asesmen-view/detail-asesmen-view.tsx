"use client";

import { getAssessmentByIdQueryOptions } from "@/features/data-asesmen/actions/get-assesment-by-id/query-options";
import { Badge, Button, Divider } from "@mantine/core";
import { IconArrowLeft, IconTool } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

export function DetailAsesmenView({ id }: { id: string }) {
  const { data: assessmentData } = useQuery(getAssessmentByIdQueryOptions(id));

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <Link href={"/dashboard/admin/data-asesmen"}>
        <Button
          className="flex w-full flex-row items-center justify-center bg-indigo-500 capitalize hover:bg-indigo-600 focus-visible:outline-2 sm:w-32"
          leftSection={<IconArrowLeft size={18} />}
        >
          back to data asesmen
        </Button>
      </Link>
      <div className="mt-5 space-y-2">
        <h1 className="text-xl font-bold uppercase sm:text-2xl">
          {assessmentData?.name}
        </h1>
        <p className="text-lg uppercase text-[#E92222] sm:text-xl">
          {assessmentData?.categoryName}
        </p>
      </div>
      <p className="mt-3 font-light text-[#333333]">
        {assessmentData?.description}
      </p>

      <h2 className="mt-5 text-lg font-bold capitalize sm:text-xl">
        tujuan asesmen
      </h2>
      <p className="font-extralight">{assessmentData?.mainGoal}</p>

      {/* Display tools if they exist */}
      {assessmentData?.tools && assessmentData.tools.length > 0 && (
        <>
          <Divider className="my-4" />
          <h2 className="mb-3 text-lg font-bold capitalize sm:text-xl">
            <IconTool className="mr-2 inline-block" size={20} />
            Peralatan yang Dibutuhkan
          </h2>
          <div className="flex flex-wrap gap-2">
            {assessmentData.tools.map((tool, i) => (
              <Badge
                key={i}
                size="lg"
                color="blue"
                variant="filled"
                className="px-3 py-1"
              >
                {tool.name} ({tool.minCount})
              </Badge>
            ))}
          </div>
        </>
      )}

      <Divider className="my-4" />
      <h2 className="mb-3 text-lg font-bold capitalize sm:text-xl">
        Langkah-langkah Asesmen
      </h2>
      <div className="mt-3 space-y-6">
        {assessmentData?.illustrations?.map((illustration, i) => (
          <div className="rounded-xl border-2 shadow-xl" key={i}>
            <div className="flex flex-col items-start gap-4 p-4 sm:p-6 md:flex-row md:gap-10">
              <div className="relative h-48 w-full overflow-hidden rounded-xl border-2 shadow-xl sm:h-60 md:h-40 md:w-64 lg:h-48">
                <Image
                  src={illustration.imageUrl || "/push-up.png"}
                  alt={`Step ${i + 1}`}
                  width={500}
                  height={500}
                  className="h-full w-full rounded-xl object-cover shadow-xl"
                  priority={i === 0}
                />
              </div>

              <div className="space-y-2 md:flex-1">
                <p className="text-lg font-bold capitalize sm:text-xl">
                  langkah #{i + 1}
                </p>
                <p className="font-extralight">{illustration.procedure}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
