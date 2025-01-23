import { queryOptions } from "@tanstack/react-query";
import { getSchoolRegistrantsBySchoolId } from ".";

export type GetSchoolRegistrantsBySchoolIdQueryOptionsResponse = Awaited<
  ReturnType<typeof getSchoolRegistrantsBySchoolIdQueryOptions>
>;

export const getSchoolRegistrantsBySchoolIdQueryOptions = (schoolId: string) =>
  queryOptions({
    queryKey: ["school-registrants", schoolId],
    queryFn: () => getSchoolRegistrantsBySchoolId(schoolId),
    staleTime: Infinity,
  });
