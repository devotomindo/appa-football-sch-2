import { getEnsiklopediById } from ".";

export function getEnsiklopediByIdQueryOptions(id: string) {
  return {
    queryKey: ["ensiklopedi", id],
    queryFn: () => getEnsiklopediById(id),
  };
}
