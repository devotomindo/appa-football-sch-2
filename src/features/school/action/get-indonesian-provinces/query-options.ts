import { queryOptions } from "@tanstack/react-query";
import { getIndonesianProvinces } from ".";

export const getIndonesianProvincesQueryOptions = () =>
  queryOptions({
    queryKey: ["indonesianProvinces"],
    queryFn: () => getIndonesianProvinces(),
  });
