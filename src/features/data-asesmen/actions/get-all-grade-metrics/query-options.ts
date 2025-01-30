import { queryOptions } from "@tanstack/react-query";
import { getAllGradeMetrics } from ".";

export const getAllGradeMetricsQueryOptions = () =>
  queryOptions({
    queryKey: ["grade-metrics", "all"],
    queryFn: () => getAllGradeMetrics(),
    staleTime: Infinity,
  });
