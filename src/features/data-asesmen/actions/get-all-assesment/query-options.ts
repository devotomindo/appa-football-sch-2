import { queryOptions } from "@tanstack/react-query";
import { getAllAssessment } from ".";

export function getAllAssesmentQueryOptions() {
  return queryOptions({
    queryKey: ["assesment", "all"],
    queryFn: () => getAllAssessment(),
  });
}
