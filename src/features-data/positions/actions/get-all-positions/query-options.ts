import { queryOptions } from "@tanstack/react-query";
import { getAllPositions } from ".";

export function getAllPositionsQueryOptions() {
  return queryOptions({
    queryKey: ["positions", "all"],
    queryFn: () => getAllPositions(),
  });
}
