"use client";

import { SubmitButton } from "@/components/buttons/submit-button";
import { recordAssessment } from "@/features/data-asesmen/actions/record-assessment";
import { useEffectEvent } from "@/lib/hooks/useEffectEvent";
import { formStateNotificationHelper } from "@/lib/notification/notification-helper";
import { NumberInput } from "@mantine/core";
import { IconDeviceFloppy } from "@tabler/icons-react";
import {
  startTransition,
  useActionState,
  useCallback,
  useEffect,
  useState,
} from "react";

export function RecordPenilaianForm({
  recordId,
  score,
  onSuccess,
  onChange,
}: {
  recordId: string;
  score?: number | undefined; // Update type to include null
  onSuccess?: () => void;
  onChange?: (value: number | undefined) => void;
}) {
  const [currentValue, setCurrentValue] = useState<number | undefined>(
    score ?? undefined, // Convert null to undefined
  );
  const [savedValue, setSavedValue] = useState<number | undefined>(
    score ?? undefined,
  );

  // Compare against saved value instead of prop
  const hasChanges = currentValue !== savedValue;

  // Simplified change handler
  const handleChange = useCallback(
    (value: number | undefined) => {
      setCurrentValue(value);
      onChange?.(value);
    },
    [onChange],
  );

  const [actionState, actionsDispatch, isActionPending] = useActionState(
    recordAssessment,
    undefined,
  );

  const actionEffectEvent = useEffectEvent((state: typeof actionState) => {
    if (state) {
      formStateNotificationHelper({
        state,
        successCallback: () => {
          // Update saved value after successful submission
          setSavedValue(currentValue);
          onSuccess?.();
        },
      });
    }
  });

  useEffect(
    () => actionEffectEvent(actionState),
    [actionState, actionEffectEvent],
  );

  // Update both values when score prop changes
  useEffect(() => {
    setCurrentValue(score ?? undefined);
    setSavedValue(score ?? undefined);
  }, [score]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.append("recordId", recordId);

        startTransition(() => actionsDispatch(formData));
      }}
    >
      <div className="flex items-center gap-2">
        <NumberInput
          name="score"
          value={currentValue}
          required
          onChange={(value) => {
            const numValue = typeof value === "number" ? value : undefined;
            handleChange(numValue);
          }}
          min={0}
          hideControls
          className="flex-1"
        />
        <SubmitButton
          loading={isActionPending}
          disabled={isActionPending || !hasChanges}
        >
          <IconDeviceFloppy />
        </SubmitButton>
      </div>
    </form>
  );
}
