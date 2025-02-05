import { queryOptions } from "@tanstack/react-query";
import { getAssessmentScoresOfCurrentAthleteWithSchoolId } from ".";

export const getAssessmentScoresOfCurrentAthleteWithSchoolIdQueryOptions = (
  schoolId: string,
) => {
  return queryOptions({
    queryKey: ["assessment-scores", schoolId],
    queryFn: () => getAssessmentScoresOfCurrentAthleteWithSchoolId(schoolId),
    enabled: !!schoolId,
  });
};
