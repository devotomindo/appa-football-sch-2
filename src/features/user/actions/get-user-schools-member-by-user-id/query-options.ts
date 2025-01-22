import { queryOptions } from "@tanstack/react-query";
import { getUserSchoolsMemberByUserId } from ".";

export type GetUserSchoolsMemberByUserIdResponse = Awaited<
  ReturnType<typeof getUserSchoolsMemberByUserId>
>;

export const getUserSchoolsMemberByUserIdQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["user-school-member", userId],
    queryFn: () => getUserSchoolsMemberByUserId(userId),
    staleTime: Infinity,
  });
