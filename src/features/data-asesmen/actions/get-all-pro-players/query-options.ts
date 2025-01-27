import { queryOptions } from "@tanstack/react-query";
import { getAllProPlayers } from ".";

export function getAllProPlayersQueryOptions() {
  return queryOptions({
    queryKey: ["pro-players", "all"],
    queryFn: () => getAllProPlayers(),
  });
}
