"use client";

import { SubmitButton } from "@/components/buttons/submit-button";
import { getAllSchoolsQueryOptions } from "@/features/school/action/get-all-schools/query-options";
import { getAllSchoolMembersBySchoolIdQueryOptions } from "@/features/school/action/get-school-members-by-school-id/query-options";
import { useEffectEvent } from "@/lib/hooks/useEffectEvent";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import { NumberInput, Select, TextInput } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { createReferral } from "../../actions/create-referral";
import { GetAllReferralsResponse } from "../../actions/get-all-referrals";
import { getReferrerSchoolByUserIdQueryOptions } from "../../actions/get-referrer-school-by-user-id/query-options";
import { updateReferral } from "../../actions/update-referral";

type CreateReferralFormProps = {
  referralData?: GetAllReferralsResponse[number];
  onSuccess?: () => void;
};

export function CreateOrUpdateReferralForm({
  referralData,
  onSuccess,
}: CreateReferralFormProps) {
  // Initialize states with referral data if it exists
  const [code, setCode] = useState(referralData?.code ?? "");
  const [schoolId, setSchoolId] = useState<string>(""); // Remove default value
  const [referrerId, setReferrerId] = useState(referralData?.referrerId ?? "");
  const [commission, setCommission] = useState<string | number>(
    referralData?.commission ?? 0,
  );
  const [discount, setDiscount] = useState<string | number>(
    referralData?.discount ?? 0,
  );

  // Query for schools list
  const schoolsQuery = useQuery(getAllSchoolsQueryOptions());

  // Query to get referrer's school if we're editing
  const referrerSchoolQuery = useQuery({
    ...getReferrerSchoolByUserIdQueryOptions(referralData?.referrerId ?? ""),
    enabled: !!referralData?.referrerId,
  });

  // Query for school members - enable when either:
  // 1. We have a selected school
  // 2. We have a referrer's school from the query
  const schoolMembersQuery = useQuery({
    ...getAllSchoolMembersBySchoolIdQueryOptions(
      schoolId || referrerSchoolQuery.data?.schoolId || "",
    ),
    enabled: !!(schoolId || referrerSchoolQuery.data?.schoolId),
  });

  // Set initial school ID when editing and we get the referrer's school
  useEffect(() => {
    if (referrerSchoolQuery.data?.schoolId) {
      setSchoolId(referrerSchoolQuery.data.schoolId);
    }
  }, [referrerSchoolQuery.data?.schoolId]);

  // Only reset referrerId when school changes manually (not from query)
  const lastManualSchoolChange = useRef(schoolId);
  useEffect(() => {
    if (
      schoolId &&
      lastManualSchoolChange.current !== schoolId &&
      schoolId !== referrerSchoolQuery.data?.schoolId
    ) {
      setReferrerId("");
    }
    lastManualSchoolChange.current = schoolId;
  }, [schoolId, referrerSchoolQuery.data?.schoolId]);

  // Use either update or create action based on whether we have referral data
  const [actionState, actionDispatch, isActionPending] = useActionState(
    referralData ? updateReferral : createReferral,
    undefined,
  );

  const actionEffectEvent = useEffectEvent((state) => {
    if (state) {
      formStateNotificationHelper({
        state,
        successCallback: () => {
          if (onSuccess) onSuccess();
        },
      });
    }
  });

  useEffect(
    () => actionEffectEvent(actionState),
    [actionState, actionEffectEvent],
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        startTransition(() => {
          const formData = new FormData();
          if (referralData) {
            formData.append("id", referralData.id);
          }
          formData.append("code", code);
          formData.append("referrerId", referrerId);
          formData.append("commission", commission.toString());
          formData.append("discount", discount.toString());
          actionDispatch(formData);
        });
      }}
      className="grid gap-4"
    >
      <TextInput
        label="Kode Referral"
        name="code"
        required
        value={code}
        onChange={(e) => setCode(e.target.value)}
        error={actionState?.error?.code}
      />

      <Select
        label="Sekolah"
        required
        value={schoolId}
        onChange={(value) => setSchoolId(value ?? "")}
        data={
          schoolsQuery.data?.map((school) => ({
            value: school.id,
            label: school.name,
          })) ?? []
        }
        placeholder={schoolsQuery.isLoading ? "Loading..." : "Pilih sekolah"}
        disabled={schoolsQuery.isLoading}
      />

      <Select
        label="Referrer"
        name="referrerId"
        required
        value={referrerId}
        onChange={(value) => setReferrerId(value ?? "")}
        error={actionState?.error?.referrerId}
        disabled={!schoolId || schoolMembersQuery.isLoading}
        data={
          schoolMembersQuery.data?.map((member) => ({
            value: member.userId,
            label: member.userFullName ?? "Unknown",
          })) ?? []
        }
        placeholder={
          schoolMembersQuery.isLoading
            ? "Loading..."
            : !schoolId
              ? "Pilih sekolah terlebih dahulu"
              : "Pilih anggota sekolah"
        }
      />

      <NumberInput
        label="Komisi (Rp)"
        name="commission"
        required
        value={commission}
        onChange={setCommission}
        error={actionState?.error?.commission}
      />

      <NumberInput
        label="Diskon (Rp)"
        name="discount"
        required
        value={discount}
        onChange={setDiscount}
        error={actionState?.error?.discount}
      />

      <div className="mt-4">
        <SubmitButton loading={isActionPending}>Simpan</SubmitButton>
      </div>
    </form>
  );
}
