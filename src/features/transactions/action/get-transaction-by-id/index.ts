"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import {
  packages,
  referrals,
  schools,
  transactions,
  userProfiles,
} from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";
import { cache } from "react";
import { getTransactionStatus } from "../get-transaction-status";

export type GetTransactionByIdResponse = Awaited<
  ReturnType<typeof getTransactionById>
>;

export const getTransactionById = cache(async function (transactionId: string) {
  const db = createDrizzleConnection();

  // Initially check Transaction to Midtrans API
  await getTransactionStatus(transactionId); // Also pushes status changes to DB

  const result = await db
    .select({
      id: transactions.id,
      createdAt: transactions.createdAt,
      updatedAt: transactions.updatedAt,
      status: transactions.status,
      paymentMethod: transactions.paymentMethod,
      billedAmount: transactions.billedAmount,
      midtransToken: transactions.midtransToken,
      packageName: packages.name,
      packageQuotaAdded: packages.quotaAddition,
      packageDuration: packages.monthDuration,
      buyerName: userProfiles.name,
      referralCode: referrals.code,
      schoolName: schools.name,
    })
    .from(transactions)
    .where(eq(transactions.id, transactionId))
    .leftJoin(packages, eq(packages.id, transactions.packageId))
    .leftJoin(userProfiles, eq(userProfiles.id, transactions.userId))
    .leftJoin(referrals, eq(referrals.id, transactions.referralId))
    .leftJoin(schools, eq(schools.id, transactions.schoolId))
    .limit(1)
    .then((res) => res[0]);

  return result;
});
