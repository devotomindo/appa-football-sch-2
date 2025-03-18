import { queryOptions } from "@tanstack/react-query";
import { getMembersByRegion } from ".";

export function getMembersByRegionQueryOptions() {
  return queryOptions({
    queryKey: ["members", "by-region"],
    queryFn: () => getMembersByRegion(),
  });
}
