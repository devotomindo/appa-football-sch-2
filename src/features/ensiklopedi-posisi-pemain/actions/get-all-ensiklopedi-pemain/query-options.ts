import { queryOptions } from "@tanstack/react-query";
import { getAllEnsiklopediPemain } from ".";

export const getAllEnsiklopediPemainQueryOptions = () => {
  return queryOptions({
    queryKey: ["ensiklopedi-pemain", "all"],
    queryFn: () => getAllEnsiklopediPemain(),
  });
};
