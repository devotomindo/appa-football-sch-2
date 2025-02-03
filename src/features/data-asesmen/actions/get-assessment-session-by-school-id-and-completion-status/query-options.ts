import type { GetAssessmentSessionBySchoolIdAndCompletionStatusParams } from ".";
import { getAssessmentSessionBySchoolIdAndCompletionStatus } from ".";

export const getAssessmentSessionBySchoolIdAndCompletionStatusQueryOptions = ({
  schoolId,
  isCompleted,
}: GetAssessmentSessionBySchoolIdAndCompletionStatusParams) => ({
  queryKey: [
    "assessment-sessions",
    "by-school-and-completion",
    schoolId,
    isCompleted,
  ],
  queryFn: () =>
    getAssessmentSessionBySchoolIdAndCompletionStatus({
      schoolId,
      isCompleted,
    }),
});
