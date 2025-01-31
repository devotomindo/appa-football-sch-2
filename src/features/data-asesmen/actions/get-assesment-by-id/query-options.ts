import { queryOptions } from "@tanstack/react-query";
import { getAssessmentById } from ".";

export function getAssessmentByIdQueryOptions(id: string) {
  return queryOptions({
    queryKey: ["assessment", id],
    queryFn: () => getAssessmentById(id),
  });
}
