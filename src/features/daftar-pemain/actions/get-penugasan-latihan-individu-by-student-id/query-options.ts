import { queryOptions } from "@tanstack/react-query";
import { getPenugasanLatihanIndividuByStudentId } from ".";

export const getPenugasanLatihanIndividuByStudentIdQueryOptions = (
  studentId: string,
) =>
  queryOptions({
    queryKey: ["penugasan-latihan-individu", studentId],
    queryFn: () => getPenugasanLatihanIndividuByStudentId(studentId),
  });
