import { useQuery } from "@tanstack/react-query";
import {
  getSchoolInfoByIdQueryOptions,
  SchoolInfoQueryKey,
} from "../action/get-school-info/query-options";
import { SchoolWithImageUrl } from "../types/school";

export function useSchoolInfo(schoolId: number) {
  return useQuery<
    SchoolWithImageUrl,
    Error,
    SchoolWithImageUrl,
    SchoolInfoQueryKey
  >({
    ...getSchoolInfoByIdQueryOptions(schoolId),
    enabled: !!schoolId,
  });
}
