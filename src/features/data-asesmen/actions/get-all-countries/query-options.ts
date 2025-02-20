import { queryOptions } from "@tanstack/react-query";
import { getAllCountries } from ".";

export function getAllCountriesQueryOptions() {
  return queryOptions({
    queryKey: ["countries", "all"],
    queryFn: () => getAllCountries(),
  });
}
