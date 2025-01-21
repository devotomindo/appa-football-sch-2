import { getSchoolInfoById } from ".";

export const getSchoolInfoByIdQueryOptions = (schoolId: string) => ({
  queryKey: ["school", "info", { id: schoolId }] as const,
  queryFn: () => getSchoolInfoById(schoolId),
});

export type SchoolInfoQueryKey = ReturnType<
  typeof getSchoolInfoByIdQueryOptions
>["queryKey"];
