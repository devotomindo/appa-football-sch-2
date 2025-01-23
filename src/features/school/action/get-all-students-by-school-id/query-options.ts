import { queryOptions } from "@tanstack/react-query";
import { getAllStudentsBySchoolId } from ".";

export type GetAllStudentsBySchoolIdQueryOptionsResponse = Awaited<
  ReturnType<typeof getAllStudentsBySchoolIdQueryOptions>
>;

export const getAllStudentsBySchoolIdQueryOptions = (schoolId: string) =>
  queryOptions({
    queryKey: ["school-athletes", schoolId],
    queryFn: () => getAllStudentsBySchoolId(schoolId),
    staleTime: Infinity,
  });
