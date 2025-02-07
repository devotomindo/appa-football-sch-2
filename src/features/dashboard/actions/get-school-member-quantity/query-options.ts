import { queryOptions } from "@tanstack/react-query";
import { getSchoolMemberQuantity } from ".";

export function getSchoolMemberQuantityQueryOptions(schoolId: string) {
  return queryOptions({
    queryKey: ["school-member-quantity", schoolId],
    queryFn: () => getSchoolMemberQuantity(schoolId),
    enabled: !!schoolId,
  });
}
