import { queryOptions } from "@tanstack/react-query";
import { getAssessmentById } from ".";

export function getAssessmentByIdQueryOptions(id: string) {
  return queryOptions({
    queryKey: ["assesment", id],
    queryFn: () => getAssessmentById(id),
  });
}
