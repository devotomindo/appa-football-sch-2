import { getBiodataPemainByStudentId } from ".";

export const getBiodataPemainByStudentIdQueryOptions = (studentId: string) => ({
  queryKey: ["biodata-pemain", studentId],
  queryFn: () => getBiodataPemainByStudentId(studentId),
  enabled: !!studentId,
});
