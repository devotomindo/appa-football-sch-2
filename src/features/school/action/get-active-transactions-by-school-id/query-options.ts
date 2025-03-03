import { queryOptions } from "@tanstack/react-query";
import { getActiveTransactionsBySchoolId } from ".";

export function getActiveTransactionsBySchoolIdQueryOptions(schoolId: string) {
  return queryOptions({
    queryKey: ["active-transactions", schoolId],
    queryFn: async () => {
      return getActiveTransactionsBySchoolId(schoolId);
    },
  });
}
