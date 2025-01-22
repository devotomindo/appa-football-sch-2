import { queryOptions } from "@tanstack/react-query";
import { getAllPosisi } from ".";

export const getAllPosisiQueryOptions = () => {
  return queryOptions({
    queryKey: ["posisi-pemain", "all"],
    queryFn: () => getAllPosisi(),
  });
};
