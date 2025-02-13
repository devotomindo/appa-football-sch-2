import { queryOptions } from "@tanstack/react-query";
import { getSchoolByCityId } from ".";

export const getSchoolByCityIdQueryOptions = (cityId: number | null) =>
  queryOptions({
    queryKey: ["schools-by-city-id", { cityId }],
    queryFn: () => getSchoolByCityId(cityId),
    enabled: !!cityId, // ensure query is only executed when cityId is provided
  });
