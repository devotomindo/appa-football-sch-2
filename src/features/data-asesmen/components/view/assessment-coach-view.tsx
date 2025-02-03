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
      <p className="text-5xl uppercase tracking-wider text-[#E92222]">
        {assessment.name}
      </p>
      <div className="space-y-4 py-16">
        <p className="text-xl font-bold uppercase">mekanisme asesmen</p>
        <div className="grid grid-cols-3 gap-5">
          {assessment.illustrations.map((item, index) => (
            <BlackBackgroundContainer key={index}>
              <div className="relative z-10 grid h-full grid-cols-2 items-center gap-10">
                <div className="h-full w-full">
                  <Image
                    src={item.imageUrl}
                    alt={item.procedure}
                    width={500}
                    height={500}
                    className="h-full w-full rounded-xl object-cover"
                  />
                </div>
                <div className="flex h-full flex-col gap-4">
                  <p className="text-lg font-bold capitalize">
                    Langkah {index + 1}
                  </p>
                  <p className="text-lg font-light capitalize">
                    {item.procedure}
                  </p>
                </div>
              </div>
            </BlackBackgroundContainer>
          ))}
        </div>
      </div>
      <PesertaAsesmenTable assessmentId={id} schoolId={schoolSession.id} />
    </div>
  );
}
