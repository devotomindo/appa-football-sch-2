import { queryOptions } from "@tanstack/react-query";
import { getLatihanById } from ".";

export const getLatihanByIdQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: ["latihan", id],
    queryFn: () => getLatihanById(id),
    enabled: !!id,
  });
};
