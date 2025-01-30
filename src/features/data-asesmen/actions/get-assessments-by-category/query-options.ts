import { queryOptions } from "@tanstack/react-query";
import { getAssessmentsByCategory } from ".";

export const getAssessmentsByCategoryQueryOptions = (
  categoryId: number | null,
) =>
  queryOptions({
    queryKey: ["assessments", "by-category", categoryId],
    queryFn: () => getAssessmentsByCategory(categoryId),
    staleTime: Infinity,
  });
