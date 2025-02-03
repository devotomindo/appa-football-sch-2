import { queryOptions } from "@tanstack/react-query";
import { getStudentsBeingGradedByPenilaianId } from ".";

export const getStudentsBeingGradedByPenilaianIdQueryOptions = (
  penilaianId: string,
) =>
  queryOptions({
    queryKey: ["penilaian-athletes", penilaianId],
    queryFn: () => getStudentsBeingGradedByPenilaianId(penilaianId),
    staleTime: Infinity,
  });
