import { queryOptions } from "@tanstack/react-query";
import { getAllPackages } from ".";

export const getAllPackagesQueryOptions = () => {
  return queryOptions({
    queryKey: ["package", "all"],
    queryFn: () => getAllPackages(),
  });
};
