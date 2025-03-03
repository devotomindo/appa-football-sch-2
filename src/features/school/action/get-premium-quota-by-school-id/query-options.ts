import { queryOptions } from "@tanstack/react-query";
import { getPremiumQuotaBySchoolId } from ".";

export function getPremiumQuotaBySchoolIdQueryOptions(schoolId: string) {
  return queryOptions({
    queryKey: ["premium-quota", schoolId],
    queryFn: async () => {
      return getPremiumQuotaBySchoolId(schoolId);
    },
  });
}
