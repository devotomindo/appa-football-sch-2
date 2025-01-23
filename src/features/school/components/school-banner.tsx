"use client";

import { Button, Skeleton } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import { SchoolWithImageUrl } from "../types/school";

export function SchoolBanner({
  schoolInfo,
  userIsHeadCoach,
}: {
  schoolInfo: SchoolWithImageUrl;
  userIsHeadCoach?: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between rounded-xl p-4 shadow-lg md:flex-row md:items-start md:gap-10 md:p-8"
      id="banner"
    >
      <div className="flex gap-6">
        <div className="relative h-full">
          {schoolInfo.imageUrl ? (
            <Image
              src={schoolInfo.imageUrl}
              alt=""
              width={80}
              height={80}
              className="md:w-[100px]"
            />
          ) : (
            <Skeleton circle height={100} />
          )}
        </div>

        <div className="space-y-4 text-center md:text-left">
          <p className="text-xl font-bold md:text-2xl">
            {schoolInfo?.name ?? "Loading..."}
          </p>
          <div className="">
            <p>{schoolInfo.address ?? "-"}</p>
            <p>{schoolInfo.phone ?? "-"}</p>
          </div>
          <p className="font-bold">{schoolInfo?.fieldLocation ?? "-"}</p>
        </div>
      </div>

      {userIsHeadCoach && (
        <Button component={Link} href={`dashboard/update-ssb/${schoolInfo.id}`}>
          Ubah Detail Sekolah
        </Button>
      )}
    </div>
  );
}
