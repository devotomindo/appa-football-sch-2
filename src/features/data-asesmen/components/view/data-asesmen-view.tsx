"use client";

import { getAllAssessmentCategoriesQueryOptions } from "@/features/data-asesmen/actions/get-all-assessment-categories/query-options";
import { getAssessmentsByCategoryQueryOptions } from "@/features/data-asesmen/actions/get-assessments-by-category/query-options";
import { Carousel } from "@mantine/carousel";
import { Button, Modal } from "@mantine/core";
import { IconEdit, IconNotes, IconTrash } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getAllProPlayersQueryOptions } from "../../actions/get-all-pro-players/query-options";
import { DeleteAsesmenForm } from "../form/delete-asesmen-form/delete-asesmen-form";

interface playerDataInterface {
  photoPath: string | null;
  positionName: string | null;
  id: string;
  playersName: string | null;
  age: number | null;
  team: string | null;
  countryName: string | null;
}

export function PlayerFrame({
  playerData,
}: {
  playerData: playerDataInterface;
}) {
  return (
    <Link
      href={`/dashboard/admin/data-asesmen/detail-pemain-pro/${playerData.id}`}
    >
      <div className="relative h-72 w-60 rounded-xl border-2 shadow-xl">
        {/* image */}
        <div className="h-3/4 w-full">
          <div className="relative flex h-full w-full items-center justify-center">
            <Image
              src={playerData.photoPath || "/messi.png"}
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
            <p className="text-sm font-bold capitalize">
              {playerData.playersName}
            </p>
            <p className="text-sm uppercase">{playerData.positionName}</p>
          </div>
          <p className="text-xs font-thin capitalize">
            {playerData.countryName} - {playerData.team}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function DataAsesmenView() {
  const { data: allProPlayersData, isLoading: allProPlayersIsLoading } =
    useQuery(getAllProPlayersQueryOptions());
  const { data: assessmentCategories } = useQuery(
    getAllAssessmentCategoriesQueryOptions(),
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const { data: filteredAssessments, isLoading: allAssessmentIsLoading } =
    useQuery(getAssessmentsByCategoryQueryOptions(selectedCategory));

  const categories =
    assessmentCategories?.map((category) => category.name) ?? [];

  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold capitalize">
          data hasil asesmen pemain pro
        </h1>
        <Link href={"/dashboard/admin/data-asesmen/tambah-pemain-pro"}>
          <Button className="!h-12 !w-80 !rounded-lg !bg-green-500 capitalize text-white hover:!bg-green-600 focus-visible:outline-2">
            tambahkan data pemain pro
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
          {allProPlayersIsLoading ? (
            <p>loading....</p>
          ) : (
            allProPlayersData?.map((item, i) => (
              <Carousel.Slide key={i}>
                <PlayerFrame playerData={item} />
              </Carousel.Slide>
            ))
          )}
        </Carousel>
      </div>

      <div className="flex justify-between">
        <h1 className="text-2xl font-bold capitalize">data asesmen</h1>
        <Link href={"/dashboard/admin/data-asesmen/asesmen/create"}>
          <Button className="!h-12 !w-96 !rounded-lg !bg-green-500 capitalize text-white hover:!bg-green-600 focus-visible:outline-2">
            tambahkan data asesmen baru
          </Button>
        </Link>
      </div>

      <div className="flex gap-2 overflow-x-auto py-2">
        <Button
          variant={selectedCategory === null ? "filled" : "light"}
          onClick={() => setSelectedCategory(null)}
          className={selectedCategory === null ? "!bg-[#333333]" : ""}
        >
          Semua
        </Button>
        {assessmentCategories?.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "filled" : "light"}
            onClick={() => setSelectedCategory(category.id)}
            className={selectedCategory === category.id ? "!bg-[#333333]" : ""}
          >
            {category.name}
          </Button>
        ))}
      </div>

      <div className="px-4">
        {allAssessmentIsLoading ? (
          <div>Loading...</div>
        ) : (
          filteredAssessments?.map((item) => {
            const categoryName = assessmentCategories?.find(
              (cat) => cat.id === item.categoryId,
            )?.name;
            return (
              <div
                className="my-8 flex items-center justify-between gap-4 border-b-2 border-[#333333] pb-2"
                key={item.id}
              >
                <Link
                  href={`/dashboard/admin/data-asesmen/detail-asesmen/${item.id}`}
                >
                  <div className="flex items-center gap-4">
                    <IconNotes />
                    <p className="uppercase">
                      {item.name} - {categoryName}
                    </p>
                  </div>
                </Link>
                <div className="flex items-center gap-4">
                  <Link
                    href={`/dashboard/admin/data-asesmen/asesmen/edit/${item.id}`}
                  >
                    <IconEdit size={24} className="text-gray-600" />
                  </Link>
                  <Button
                    variant="subtle"
                    size="xs"
                    p={0}
                    className="h-6 w-6 min-w-0"
                    onClick={() => {
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <IconTrash size={24} className="!text-red-600" />
                  </Button>
                </div>
                <Modal
                  title="Hapus Asesmen?"
                  opened={isDeleteModalOpen}
                  onClose={() => {
                    setIsDeleteModalOpen(false);
                  }}
                  centered
                  styles={{
                    overlay: {
                      backgroundColor: "rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  <DeleteAsesmenForm
                    onSuccess={() => {
                      setIsDeleteModalOpen(false);
                    }}
                    assesmentId={item.id}
                  />
                </Modal>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
