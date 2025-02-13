import { queryOptions } from "@tanstack/react-query";
import { getProPlayerById } from ".";

export function getProPlayerByIdQueryOptions(id: string) {
  return queryOptions({
    queryKey: ["pro_player", id],
    queryFn: () => getProPlayerById(id),
    enabled: !!id,
  });
}
