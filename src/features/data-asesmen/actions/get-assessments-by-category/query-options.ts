import { queryOptions } from "@tanstack/react-query";
import { getAssessmentsByCategory } from ".";

export function getAssessmentsByCategoryQueryOptions(
  categoryId: number | null,
) {
  return queryOptions({
    queryKey: ["assessments", { categoryId }],
    queryFn: () => getAssessmentsByCategory(categoryId),
  });
}
