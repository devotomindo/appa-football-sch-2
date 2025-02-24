"use client";

import { getAllAssessmentCategoriesQueryOptions } from "@/features/data-asesmen/actions/get-all-assessment-categories/query-options";
import { getAssessmentsByCategoryQueryOptions } from "@/features/data-asesmen/actions/get-assessments-by-category/query-options";
import { Carousel } from "@mantine/carousel";
import { Button, Modal } from "@mantine/core";
import { IconEdit, IconNotes, IconTrash } from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
      <div className="flex flex-col gap-6 rounded-lg border-2 shadow-lg md:h-80 md:w-80">
        {/* image */}
        <div className="relative pt-12">
          <div className="relative flex h-full w-full items-center justify-center">
            <Image
              src={playerData.photoPath || "/messi.png"}
              alt=""
              width={500}
              height={500}
              className="h-72 w-52 rounded-lg object-cover md:h-52 md:w-52"
            />
          </div>
        </div>
        {/* text */}
        <div className="flex flex-col gap-4 rounded-bl-lg rounded-br-lg bg-[#333333] py-2 text-white md:py-4">
          <div className="flex flex-col items-center gap-1 font-bold md:h-11 md:flex-row md:justify-between md:pl-4">
            <p className="break-words capitalize md:flex-1 md:text-start">
              {playerData.playersName}
            </p>
            <p className="break-words md:flex-1 md:text-center">
              {playerData.positionName}
            </p>
          </div>
          <div className="text-center font-thin md:pl-4 md:text-start md:text-xs">
            <p className="uppercase">
              {playerData.countryName} - {playerData.team}
            </p>
          </div>
        </div>
        {/* <div className="grid grid-cols-2">
          <p className="break-words capitalize md:flex-1 md:text-center">
            {playerData.playersName}
          </p>
          <p className="break-words md:flex-1 md:text-center">
            {playerData.positionName}
          </p>
          <p className="uppercase">
            {playerData.countryName} - {playerData.team}
          </p>
        </div> */}
      </div>
    </Link>
  );
}

export function DataAsesmenView() {
  const queryClient = useQueryClient();
  const { data: allProPlayersData, isLoading: allProPlayersIsLoading } =
    useQuery(getAllProPlayersQueryOptions());
  const { data: assessmentCategories } = useQuery(
    getAllAssessmentCategoriesQueryOptions(),
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<
    string | null
  >(null);

  const { data: filteredAssessments, isLoading: allAssessmentIsLoading } =
    useQuery(getAssessmentsByCategoryQueryOptions(selectedCategory));

  const handleDeleteSuccess = () => {
    // Invalidate queries to trigger refetch
    queryClient.invalidateQueries({ queryKey: ["assessments"] });
    setIsDeleteModalOpen(false);
    setSelectedAssessmentId(null);
  };

  return (
    <div className="space-y-4 p-4 sm:space-y-6 md:space-y-8">
      <div className="flex flex-col gap-4 sm:items-center sm:gap-6 md:flex-row md:justify-between md:gap-8">
        <h1 className="text-xl font-bold capitalize sm:text-2xl md:text-xl xl:text-2xl">
          data hasil asesmen pemain pro
        </h1>
        <div className="flex justify-center">
          <Link href={"/dashboard/admin/data-asesmen/tambah-pemain-pro"}>
            <Button className="!h-10 !w-full !rounded-lg !bg-green-500 capitalize text-white hover:!bg-green-600 focus-visible:outline-2 sm:!h-11 md:!h-12 md:!w-80">
              tambahkan data pemain pro
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-4 sm:mt-6 md:mt-8">
        <Carousel
          withIndicators
          withControls
          height={500}
          slideSize={{
            base: "100%",
            sm: "50%",
            md: "33%",
            lg: "25%",
            xl: "20%",
          }}
          slideGap={{ base: "sm", sm: "md" }}
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

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between md:gap-8">
        <h1 className="text-xl font-bold capitalize sm:text-xl md:text-2xl lg:text-center">
          data asesmen
        </h1>
        <div className="flex justify-center">
          <Link href={"/dashboard/admin/data-asesmen/asesmen/create"}>
            <Button className="!h-10 w-full !rounded-lg !bg-green-500 capitalize text-white hover:!bg-green-600 focus-visible:outline-2 sm:!h-11 md:!h-12 md:max-w-md lg:max-w-lg xl:max-w-xl">
              tambahkan data asesmen baru
            </Button>
          </Link>
        </div>
      </div>

      {/* Modified assessment categories section */}
      <div className="scrollbar-hide flex w-full overflow-x-auto pb-2">
        <div className="flex gap-2 sm:gap-3 md:gap-4">
          <Button
            variant={selectedCategory === null ? "filled" : "light"}
            onClick={() => setSelectedCategory(null)}
            className={`${
              selectedCategory === null ? "!bg-[#333333]" : ""
            } min-w-max whitespace-nowrap text-xs sm:text-sm md:text-base`}
          >
            Semua
          </Button>
          {assessmentCategories?.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "filled" : "light"}
              onClick={() => setSelectedCategory(category.id)}
              className={`${
                selectedCategory === category.id ? "!bg-[#333333]" : ""
              } min-w-max whitespace-nowrap text-xs sm:text-sm md:text-base`}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="px-2 sm:px-3 md:px-4">
        {allAssessmentIsLoading ? (
          <div className="text-center">Loading...</div>
        ) : (
          filteredAssessments?.map((item) => {
            const categoryName = assessmentCategories?.find(
              (cat) => cat.id === item.categoryId,
            )?.name;
            return (
              <div
                className="my-4 flex items-center justify-between gap-2 border-b-2 border-[#333333] pb-2 sm:my-6 sm:gap-3 md:my-8 md:gap-4"
                key={item.id}
              >
                <Link
                  href={`/dashboard/admin/data-asesmen/detail-asesmen/${item.id}`}
                >
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                    <IconNotes className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                    <p className="text-sm uppercase sm:text-base md:text-lg">
                      {item.name} - {categoryName}
                    </p>
                  </div>
                </Link>
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                  <Link
                    href={`/dashboard/admin/data-asesmen/asesmen/edit/${item.id}`}
                  >
                    <IconEdit className="h-5 w-5 text-gray-600 sm:h-6 sm:w-6" />
                  </Link>
                  <Button
                    variant="subtle"
                    size="xs"
                    p={0}
                    className="h-5 w-5 min-w-0 sm:h-6 sm:w-6"
                    onClick={() => {
                      setSelectedAssessmentId(item.id);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <IconTrash className="!h-5 !w-5 !text-red-600 sm:!h-6 sm:!w-6" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Modal
        title="Hapus Asesmen?"
        opened={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedAssessmentId(null);
        }}
        centered
        styles={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        {selectedAssessmentId && (
          <DeleteAsesmenForm
            onSuccess={handleDeleteSuccess}
            assesmentId={selectedAssessmentId}
          />
        )}
      </Modal>
    </div>
  );
}
