import { queryOptions } from "@tanstack/react-query";
import { getAllSchools } from ".";

export const getAllSchoolsQueryOptions = () =>
  queryOptions({
    queryKey: ["all-schools"],
    queryFn: () => getAllSchools(),
  });
