import { queryOptions } from "@tanstack/react-query";
import { getAllReferrals } from ".";

export const getAllReferralsQueryOptions = () => {
  return queryOptions({
    queryKey: ["referrals", "all"],
    queryFn: () => getAllReferrals(),
  });
};
