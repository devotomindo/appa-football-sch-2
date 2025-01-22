"use client";
import { SubmitButton } from "@/components/buttons/submit-button";
import { getAllSchoolRoleQueryOptions } from "@/features/school/action/get-all-school-roles/query-options";
import { getSchoolByCityIdQueryOptions } from "@/features/school/action/get-school-by-city-id/query-options";
import { GetUserByIdResponse } from "@/features/user/actions/get-user-by-id";
import { registerToSchool } from "@/features/user/actions/register-to-school";
import { useEffectEvent } from "@/lib/hooks/useEffectEvent";
import {
  formStateNotificationHelper,
  notificationHelper,
} from "@/lib/notification/notification-helper";
import { Button, Group, Radio, Select } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  FormEvent,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";

export function PendaftaranAtletForm({
  userData,
  onSuccess,
}: {
  userData: GetUserByIdResponse;
  onSuccess?: () => void;
}) {
  const allSchoolRoles = useQuery(getAllSchoolRoleQueryOptions());

  const schoolRoleRadioOptions = allSchoolRoles.data
    ?.filter((schoolRole) => schoolRole.name !== "Head Coach")
    .map((schoolRole) => ({
      value: schoolRole.id,
      label: schoolRole.name,
    }));

  const [selectedSchoolRole, setSelectedSchoolRole] = useState<string | null>(
    null,
  );

  const schoolByUserCityId = useQuery(
    getSchoolByCityIdQueryOptions(userData.domisiliKota),
  );

  const schoolSelectOptions = schoolByUserCityId.data?.map((school) => ({
    value: school.id.toString(),
    label: school.name,
  }));

  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);

  const [actionState, actionDispatch, isActionPending] = useActionState(
    registerToSchool,
    undefined,
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedSchoolRole || !selectedSchool) return;

    startTransition(() => {
      const formData = new FormData();
      formData.append("roleId", selectedSchoolRole);
      formData.append("schoolId", selectedSchool);

      actionDispatch(formData);
    });
  };

  const actionEffectEvent = useEffectEvent((state: typeof actionState) => {
    if (state) {
      // Show field-specific errors as notifications too
      if (state.error?.roleId) {
        notificationHelper({
          type: "error",
          message: state.error.roleId,
        });
      }
      if (state.error?.schoolId) {
        notificationHelper({
          type: "error",
          message: state.error.schoolId,
        });
      }

      formStateNotificationHelper({
        state,
        successCallback: () => {
          onSuccess?.();
        },
      });
    }
  });

  useEffect(
    () => actionEffectEvent(actionState),
    [actionState, actionEffectEvent],
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <Radio.Group
          withAsterisk
          error={allSchoolRoles.isError || actionState?.error?.roleId}
          label="Pilih Peran di SSB"
          mb={4}
        >
          <Group>
            {schoolRoleRadioOptions?.map((option) => (
              <Radio
                checked={selectedSchoolRole === option.value.toString()}
                key={option.value}
                value={option.value.toString()}
                label={option.label}
                onChange={(event) =>
                  setSelectedSchoolRole(event.currentTarget.value)
                }
              />
            ))}
          </Group>
        </Radio.Group>

        {/* Choose SSB Based on user domisiliKota */}
        {selectedSchoolRole &&
          (schoolSelectOptions && schoolSelectOptions.length > 0 ? (
            <Select
              label="Pilih SSB"
              placeholder="Pilih SSB"
              data={schoolSelectOptions}
              error={schoolByUserCityId.isError || actionState?.error?.schoolId}
              required
              searchable
              onChange={(value) => setSelectedSchool(value)}
            />
          ) : (
            <div className="text-red-500">
              Belum ada SSB di kota Anda. Silahkan ubah kota domisili Anda atau
              hubungi pihak SSB.
            </div>
          ))}

        {/* Button to add SSB as a Head Coach */}
        {selectedSchoolRole === "2" && ( // 2 is Coach
          <div className="flex items-center gap-2">
            Tidak ada SSB yang dituju?{" "}
            <Button
              color={"#E5BB25"}
              component={Link}
              href={"/dashboard/pendaftaran-ssb"}
            >
              Daftarkan SSB
            </Button>
          </div>
        )}

        <SubmitButton
          loading={isActionPending}
          fullWidth
          disabled={!selectedSchool || !selectedSchoolRole}
        >
          Daftar
        </SubmitButton>
      </div>
    </form>
  );
}
