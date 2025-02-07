import { queryOptions } from "@tanstack/react-query";
import { getAssessmentScoresWithStudentId } from ".";

export const getAssessmentScoresWithStudentIdQueryOptions = (
  studentId: string,
) => {
  return queryOptions({
    queryKey: ["assessment-scores", "student-id", studentId],
    queryFn: () => getAssessmentScoresWithStudentId(studentId),
    enabled: !!studentId,
  });
};
