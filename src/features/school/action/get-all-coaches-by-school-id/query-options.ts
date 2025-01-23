import { queryOptions } from "@tanstack/react-query";
import { getAllCoachesBySchoolId } from ".";

export type GetAllCoachesBySchoolIdQueryOptionsResponse = Awaited<
  ReturnType<typeof getAllCoachesBySchoolIdQueryOptions>
>;

export const getAllCoachesBySchoolIdQueryOptions = (schoolId: string) =>
  queryOptions({
    queryKey: ["school-coaches", schoolId],
    queryFn: () => getAllCoachesBySchoolId(schoolId),
    staleTime: Infinity,
  });
