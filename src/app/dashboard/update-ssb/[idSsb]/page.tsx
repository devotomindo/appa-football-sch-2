import { getSchoolInfoById } from "@/features/school/action/get-school-info";
import { CreateOrUpdateSchoolForm } from "@/features/school/form/create-or-update-school-form";

export default async function UpdateSSBPage({
  params,
}: {
  params: Promise<{ idSsb: string }>;
}) {
  const idSsb = (await params).idSsb;

  // Fetch SSB data
  const schoolData = await getSchoolInfoById(idSsb);

  return (
    <div>
      <CreateOrUpdateSchoolForm schoolData={schoolData} />
    </div>
  );
}
