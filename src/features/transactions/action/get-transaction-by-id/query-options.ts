import { queryOptions } from "@tanstack/react-query";
import { getTransactionById } from ".";

export const getTransactionByIdQueryOptions = (transactionId: string) =>
  queryOptions({
    queryKey: ["transaction", transactionId],
    queryFn: () => getTransactionById(transactionId),
  });
