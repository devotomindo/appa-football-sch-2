import { getPenugasanLatihanIndividuByStudentId } from "@/features/daftar-pemain/actions/get-penugasan-latihan-individu-by-student-id";
import { queryOptions } from "@tanstack/react-query";
import { getAllLatihanIndividu } from ".";

export const getAllLatihanIndividuQueryOptions = (
  studentId: string | undefined,
) => {
  return queryOptions({
    queryKey: ["latihan-individu", studentId ?? "all"],
    queryFn: studentId
      ? () => getPenugasanLatihanIndividuByStudentId(studentId)
      : () => getAllLatihanIndividu(),
  });
};
