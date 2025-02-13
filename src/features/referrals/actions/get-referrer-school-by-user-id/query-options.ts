import { getReferrerSchoolByUserId } from ".";

export const getReferrerSchoolByUserIdQueryOptions = (userId: string) => ({
  queryKey: ["referrer-school", userId],
  queryFn: () => getReferrerSchoolByUserId(userId),
});
