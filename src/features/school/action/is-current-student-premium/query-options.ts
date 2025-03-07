import { queryOptions } from "@tanstack/react-query";
import { isCurrentStudentPremium } from ".";

export type isCurrentStudentPremiumQueryOptionsResponse = Awaited<
  ReturnType<typeof isCurrentStudentPremiumQueryOptions>
>;

export const isCurrentStudentPremiumQueryOptions = (studentId: string) =>
  queryOptions({
    queryKey: ["is-student-premium", studentId],
    queryFn: () => isCurrentStudentPremium(studentId),
    staleTime: Infinity,
    // Only enable the query if the studentId is valid
    enabled: Boolean(studentId && studentId.trim() !== ""),
  });
