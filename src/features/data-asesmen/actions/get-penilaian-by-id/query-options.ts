import { queryOptions } from "@tanstack/react-query";
import { getPenilaianById } from ".";

export function getPenilaianByIdQueryOptions(id: string) {
  return queryOptions({
    queryKey: ["penilaian", id],
    queryFn: () => getPenilaianById(id),
  });
}
