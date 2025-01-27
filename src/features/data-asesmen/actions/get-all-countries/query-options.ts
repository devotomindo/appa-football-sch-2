import { queryOptions } from "@tanstack/react-query";
import { GetAllCountries } from ".";

export function GetAllCountriesQueryOptions() {
  return queryOptions({
    queryKey: ["countries", "all"],
    queryFn: () => GetAllCountries(),
  });
}
