import { queryOptions } from "@tanstack/react-query";
import { getAllAlatLatihan, getAllAlatLatihanWithoutImage } from ".";

export const getAllAlatLatihanQueryOptions = () =>
  queryOptions({
    queryKey: ["alat-latihan", "all"],
    queryFn: () => getAllAlatLatihan(),
    staleTime: Infinity,
  });

export const getAllAlatLatihanWithoutImageQueryOptions = () =>
  queryOptions({
    queryKey: ["alat-latihan", "all", "without-image"],
    queryFn: () => getAllAlatLatihanWithoutImage(),
    staleTime: Infinity,
  });
