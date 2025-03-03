import { queryOptions } from "@tanstack/react-query";
import { getCurrentUserTransactions } from ".";

export const getCurrentUserTransactionsQueryOptions = () =>
  queryOptions({
    queryKey: ["transaction", "current-user"],
    queryFn: () => getCurrentUserTransactions(),
  });
