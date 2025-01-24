import { queryOptions } from "@tanstack/react-query";
import { getAllLatihanIndividu } from ".";

export const getAllLatihanIndividuQueryOptions = () => {
  return queryOptions({
    queryKey: ["latihan-individu", "all"],
    queryFn: () => getAllLatihanIndividu(),
  });
};
