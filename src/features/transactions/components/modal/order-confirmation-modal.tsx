"use client";

import { GetAllPackagesResponse } from "@/features/daftar-paket/actions/get-all-daftar-paket";
import { GetUserByIdResponse } from "@/features/user/actions/get-user-by-id";
import { SchoolSession } from "@/lib/session";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import { Alert, Stack, TextInput } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { useState } from "react";
import { CheckReferralForm } from "../form/check-referral-form";
import { CreateTransactionForm } from "../form/create-transaction-form";

export function OrderConfirmationModalContent({
  userData,
  schoolSession,
  packageData,
}: {
  userData: GetUserByIdResponse;
  schoolSession: SchoolSession;
  packageData: GetAllPackagesResponse[number];
}) {
  const [referralCode, setReferralCode] = useState<string>("");
  const [discount, setDiscount] = useState<number | null>(null);
  const [isReferralValidated, setIsReferralValidated] = useState(true);
  const [isReferralLocked, setIsReferralLocked] = useState(false);

  const finalPrice = packageData.price - (discount ?? 0);

  // Handle referral code input changes
  const handleReferralCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCode = e.currentTarget.value;
    setReferralCode(newCode);
    // If there's any input and it hasn't been validated, disable the form
    setIsReferralValidated(newCode === "");
  };

  if (!userData || !schoolSession) return null;

  return (
    <Stack>
      <div>
        <div className="mb-2 text-sm font-semibold text-gray-600">
          Nama Pengguna
        </div>
        <div>{userData.name}</div>
      </div>

      <div>
        <div className="mb-2 text-sm font-semibold text-gray-600">
          Nama Sekolah
        </div>
        <div>{schoolSession.name}</div>
      </div>

      <div>
        <div className="mb-2 text-sm font-semibold text-gray-600">
          Tambahan Kuota Pemain
        </div>
        <div>{packageData.quotaAddition} Pemain</div>
      </div>

      <div>
        <div className="mb-2 text-sm font-semibold text-gray-600">
          Masa Berlaku
        </div>
        <div>{packageData.monthDuration} Bulan</div>
      </div>

      <div>
        <div className="mb-2 text-sm font-semibold text-gray-600">Harga</div>
        <div className="flex flex-col gap-1">
          <div
            className={
              discount && discount > 0 ? "text-gray-500 line-through" : ""
            }
          >
            {formatRupiah(packageData.price)}
          </div>
          {discount && discount > 0 && (
            <>
              <div className="text-green-600">
                <span className="font-semibold">
                  {formatRupiah(finalPrice)}
                </span>{" "}
                (-{formatRupiah(discount)})
              </div>
              <Alert icon={<IconInfoCircle />}>
                Segera konfirmasi pesanan untuk memperoleh harga diskon
              </Alert>
            </>
          )}
        </div>
      </div>

      <TextInput
        label="Kode Referral (Optional)"
        placeholder="Masukkan kode referral"
        value={referralCode}
        onChange={handleReferralCodeChange}
        className="flex-grow"
        disabled={isReferralLocked}
        rightSection={
          <CheckReferralForm
            referralCode={referralCode}
            onSuccess={(result) => {
              if (result?.discount) {
                setDiscount(result.discount);
                setIsReferralValidated(true);
                setIsReferralLocked(true); // Lock the input after successful validation
              }
            }}
          />
        }
      />

      <CreateTransactionForm
        userId={userData.id}
        schoolId={schoolSession.id}
        packageId={packageData.id}
        referralCode={referralCode}
        finalPrice={finalPrice}
        disabled={!isReferralValidated}
      />
    </Stack>
  );
}
