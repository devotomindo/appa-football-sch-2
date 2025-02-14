import { queryOptions } from "@tanstack/react-query";
import { getAllTransactions } from ".";

export const getAllTransactionsQueryOptions = () =>
  queryOptions({
    queryKey: ["transactions", "all"],
    queryFn: () => getAllTransactions(),
  });
