import { getPenugasanLatihanIndividuByStudentId } from "@/features/daftar-pemain/actions/get-penugasan-latihan-individu-by-student-id";
import { queryOptions } from "@tanstack/react-query";
import { getAllLatihanIndividu } from ".";

export const getAllLatihanIndividuByStudentIdQueryOptions = (
  studentId: string,
) => {
  return queryOptions({
    queryKey: ["latihan-individu", studentId],
    queryFn: () => getPenugasanLatihanIndividuByStudentId(studentId),
  });
};

export const getAllLatihanIndividuQueryOptions = () => {
  return queryOptions({
    queryKey: ["latihan-individu", "all"],
    queryFn: () => getAllLatihanIndividu(),
  });
};
