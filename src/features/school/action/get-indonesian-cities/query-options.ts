import { queryOptions } from "@tanstack/react-query";
import { getIndonesianCities } from ".";

export const getIndonesianCitiesQueryOptions = () =>
  queryOptions({
    queryKey: ["indonesianCities"],
    queryFn: () => getIndonesianCities(),
  });
