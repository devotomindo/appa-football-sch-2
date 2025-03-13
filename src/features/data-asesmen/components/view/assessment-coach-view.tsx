"use client";

import { PesertaAsesmenTable } from "@/features/assesmen-pemain/components/table/peserta-asesmen-table";
import { SchoolSession } from "@/lib/session";
import { Skeleton } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { getAssessmentByIdQueryOptions } from "../../actions/get-assesment-by-id/query-options";

export function AssessmentCoachView({
  id,
  schoolSession,
}: {
  id: string;
  schoolSession: SchoolSession;
}) {
  const { data: assessment, isLoading } = useQuery(
    getAssessmentByIdQueryOptions(id),
  );

  if (isLoading || !assessment) {
    return (
      <div className="space-y-8">
        <Skeleton height={40} width="30%" />
        <Skeleton height={60} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height={400} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="font-bold uppercase">asesmen</p>
      <div className="flex flex-col gap-8">
        <div>
          <p className="mb-6 text-3xl uppercase tracking-wider text-[#E92222] md:text-4xl lg:text-5xl">
            {assessment.name}
          </p>
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-1 w-8 bg-[#E92222]" />
              <p className="text-lg font-bold uppercase md:text-xl">
                mekanisme asesmen
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
              {assessment.illustrations.map((item, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl bg-white p-[1px] shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Subtle gradient border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#E92222]/20 to-orange-500/20 opacity-50 transition-all duration-500 group-hover:opacity-70" />

                  {/* Card content */}
                  <div className="relative z-10 flex h-full flex-col rounded-2xl bg-white">
                    <div className="relative h-56 w-full overflow-hidden rounded-t-xl sm:h-72">
                      <div className="absolute left-4 top-4 z-10 rounded-full bg-gradient-to-r from-[#E92222] to-red-500 px-4 py-2 text-sm font-bold text-white shadow-md">
                        Langkah {index + 1}
                      </div>
                      <Image
                        src={item.imageUrl}
                        alt={item.procedure}
                        width={500}
                        height={500}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex min-h-[60px] items-center justify-center px-4 py-3">
                      <p className="text-center text-base font-medium capitalize text-gray-700 md:text-lg">
                        {item.procedure}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tools Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-1 w-8 bg-[#E92222]" />
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold uppercase md:text-xl">
                peralatan yang dibutuhkan
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            {assessment.tools.map((tool) => (
              <div
                key={tool.id}
                className="group relative overflow-hidden rounded-2xl bg-white p-[1px] shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Subtle gradient border */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#E92222]/20 to-orange-500/20 opacity-50 transition-all duration-500 group-hover:opacity-70" />

                {/* Card content */}
                <div className="relative z-10 flex h-full flex-col items-center gap-4 rounded-2xl bg-white p-1">
                  <div className="relative h-56 w-full overflow-hidden rounded-xl sm:h-64">
                    {tool.imageUrl && (
                      <Image
                        src={tool.imageUrl}
                        alt={tool.name ?? "Unknown"}
                        width={500}
                        height={500}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="flex flex-col items-center gap-3 px-4 py-4 text-center">
                    <p className="text-base font-bold capitalize text-gray-800 md:text-lg">
                      {tool.name}
                    </p>
                    {tool.minCount && (
                      <span className="relative overflow-hidden rounded-full bg-red-50 px-4 py-1 text-sm text-[#E92222] transition-all duration-300 hover:bg-red-100">
                        Min. {tool.minCount} buah
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <PesertaAsesmenTable assessmentId={id} schoolId={schoolSession.id} />
      </div>
    </div>
  );
}
