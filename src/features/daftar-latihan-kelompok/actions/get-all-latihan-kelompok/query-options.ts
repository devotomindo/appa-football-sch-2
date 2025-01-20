import { queryOptions } from "@tanstack/react-query";
import { getAllLatihanKelompok } from ".";

export const getAllLatihanKelompokQueryOptions = () => {
  return queryOptions({
    queryKey: ["latihan-kelompok", "all"],
    queryFn: () => getAllLatihanKelompok(),
  });
};
