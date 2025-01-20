import { queryOptions } from "@tanstack/react-query";
import { getAllSchoolRole } from ".";

export const getAllSchoolRoleQueryOptions = () =>
  queryOptions({
    queryKey: ["school-role", "all"],
    queryFn: () => getAllSchoolRole(),
    staleTime: Infinity,
  });
