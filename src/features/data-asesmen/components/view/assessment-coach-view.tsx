"use client";

import { BlackBackgroundContainer } from "@/components/container/black-backgorund-container";
import { PesertaAsesmenTable } from "@/features/assesmen-pemain/components/table/peserta-asesmen-table";
import { SchoolSession } from "@/lib/session";
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
    return <p>Loading...</p>;
  }

  return (
    <div>
      <p className="font-bold uppercase">asesmen</p>
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-3xl uppercase tracking-wider text-[#E92222] md:text-4xl lg:text-5xl">
            {assessment.name}
          </p>
          <div className="">
            <p className="mb-2 text-lg font-bold uppercase md:text-xl">
              mekanisme asesmen
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
              {assessment.illustrations.map((item, index) => (
                <BlackBackgroundContainer key={index}>
                  <div className="relative z-10 flex h-full flex-col items-center gap-6 md:grid md:grid-cols-2 md:gap-10">
                    <div className="h-48 w-full sm:h-64 md:h-full">
                      <Image
                        src={item.imageUrl}
                        alt={item.procedure}
                        width={500}
                        height={500}
                        className="h-full w-full rounded-xl object-cover"
                      />
                    </div>
                    <div className="flex h-full flex-col gap-3 py-4 md:gap-4 md:py-0">
                      <p className="text-base font-bold capitalize md:text-lg">
                        Langkah {index + 1}
                      </p>
                      <p className="text-base font-light capitalize md:text-lg">
                        {item.procedure}
                      </p>
                    </div>
                  </div>
                </BlackBackgroundContainer>
              ))}
            </div>
          </div>
        </div>

        {/* Tools Section */}
        <div>
          <p className="mb-2 text-lg font-bold uppercase md:text-xl">
            peralatan yang dibutuhkan
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-4">
            {assessment.tools.map((tool) => (
              <BlackBackgroundContainer key={tool.id}>
                <div className="relative z-10 flex h-full flex-col items-center gap-4">
                  <div className="h-48 w-full sm:h-52">
                    {tool.imageUrl && (
                      <Image
                        src={tool.imageUrl}
                        alt={tool.name ?? "Unknown"}
                        width={500}
                        height={500}
                        className="h-full w-full rounded-xl object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-col items-center gap-2 py-4">
                    <p className="text-center text-base font-bold capitalize md:text-lg">
                      {tool.name}
                    </p>
                    {tool.minCount && (
                      <p className="text-center text-sm text-gray-400">
                        Minimal {tool.minCount} buah
                      </p>
                    )}
                  </div>
                </div>
              </BlackBackgroundContainer>
            ))}
          </div>
        </div>

        <PesertaAsesmenTable assessmentId={id} schoolId={schoolSession.id} />
      </div>
    </div>
  );
}
