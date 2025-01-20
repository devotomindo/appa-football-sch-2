import { queryOptions } from "@tanstack/react-query";
import { getCitiesByProvinceId } from ".";

export const getCitiesByProvinceIdQueryOptions = (provinceId: number | null) =>
  queryOptions({
    queryKey: ["citiesByProvinceId", { provinceId }],
    queryFn: () => getCitiesByProvinceId(provinceId),
    enabled: !!provinceId, // ensure query is only executed when provinceId is provided
  });
