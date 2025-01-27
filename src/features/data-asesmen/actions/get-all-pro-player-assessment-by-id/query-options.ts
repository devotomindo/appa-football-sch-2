import { queryOptions } from "@tanstack/react-query";
import { getAllProPlayerAssessmentById } from ".";

export function getAllProPlayerAssessmentByIdQueryOptions(proPlayerId: string) {
  return queryOptions({
    queryKey: ["proPlayerAssessment", "all", proPlayerId],
    queryFn: () => getAllProPlayerAssessmentById(proPlayerId),
  });
}
