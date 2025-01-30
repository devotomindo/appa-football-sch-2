import { queryOptions } from "@tanstack/react-query";
import { getAllAssessmentCategories } from ".";

export const getAllAssessmentCategoriesQueryOptions = () =>
  queryOptions({
    queryKey: ["assessment-categories", "all"],
    queryFn: () => getAllAssessmentCategories(),
    staleTime: Infinity,
  });
