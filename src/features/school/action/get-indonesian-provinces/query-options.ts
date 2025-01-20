import { queryOptions } from "@tanstack/react-query";
import { getIndonesianProvinces } from ".";

export const getIndonesianProvincesQueryOptions = () =>
  queryOptions({
    queryKey: ["indonesianStates"],
    queryFn: () => getIndonesianProvinces(),
  });
