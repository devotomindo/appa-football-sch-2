import { queryOptions } from "@tanstack/react-query";
import { getSchoolMembersBySchoolId } from ".";

export const getAllSchoolMembersBySchoolIdQueryOptions = (schoolId: string) =>
  queryOptions({
    queryKey: ["school-members", schoolId],
    queryFn: () => getSchoolMembersBySchoolId(schoolId),
    staleTime: Infinity,
  });
