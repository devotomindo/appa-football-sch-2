"use client";

import { getEnsiklopediByIdQueryOptions } from "@/features/ensiklopedi-posisi-pemain/actions/get-ensiklopedi-by-id/query-options";
import { useQuery } from "@tanstack/react-query";
import { EnsiklopediPosisiPemainForm } from "../../form/ensiklopedi-posisi-pemain-form";

export default function EditEnsiklopediPemainView({ id }: { id: string }) {
  const { data } = useQuery(getEnsiklopediByIdQueryOptions(id));

  return <EnsiklopediPosisiPemainForm isEdit={true} initialData={data} />;
}
