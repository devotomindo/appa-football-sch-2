import { queryOptions } from "@tanstack/react-query";
import { getCoachRegistrantsBySchoolId } from ".";

export type GetCoachRegistrantsBySchoolIdQueryOptionsResponse = Awaited<
  ReturnType<typeof getCoachRegistrantsBySchoolIdQueryOptions>
>;

export const getCoachRegistrantsBySchoolIdQueryOptions = (schoolId: string) =>
  queryOptions({
    queryKey: ["coach-registrants", schoolId],
    queryFn: () => getCoachRegistrantsBySchoolId(schoolId),
    staleTime: Infinity,
  });
