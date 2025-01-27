import { queryOptions } from "@tanstack/react-query";
import { getAllPositions } from ".";

export function GetAllPositionsQueryOptions() {
  return queryOptions({
    queryKey: ["positions", "all"],
    queryFn: () => getAllPositions(),
  });
}
