import { queryOptions } from "@tanstack/react-query";
import { getLatihanById } from ".";

export const getLatihanByIdQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: ["latihan-kelompok", id],
    queryFn: () => getLatihanById(id),
  });
};
