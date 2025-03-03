"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import {
  packages,
  referrals,
  schools,
  transactions,
  userProfiles,
} from "@/db/drizzle/schema";
import { authGuard } from "@/features/user/guards/auth-guard";
import { eq } from "drizzle-orm";
import { cache } from "react";
import { getTransactionStatus } from "../get-transaction-status";

export type GetCurrentUserTransactionsResponse = Awaited<
  ReturnType<typeof getCurrentUserTransactions>
>;

export const getCurrentUserTransactions = cache(async function () {
  const db = createDrizzleConnection();

  // Auth Guard
  const authGuardResponse = await authGuard();
  const userId = authGuardResponse.data?.id;

  if (!userId) {
    return [];
  }

  const result = await db
    .select({
      id: transactions.id,
      createdAt: transactions.createdAt,
      updatedAt: transactions.updatedAt,
      status: transactions.status,
      paymentMethod: transactions.paymentMethod,
      billedAmount: transactions.billedAmount,
      packageName: packages.name,
      packageQuotaAdded: packages.quotaAddition,
      packageDuration: packages.monthDuration,
      buyerName: userProfiles.name,
      referralCode: referrals.code,
      schoolName: schools.name,
    })
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .leftJoin(packages, eq(packages.id, transactions.packageId))
    .leftJoin(userProfiles, eq(userProfiles.id, transactions.userId))
    .leftJoin(referrals, eq(referrals.id, transactions.referralId))
    .leftJoin(schools, eq(schools.id, transactions.schoolId));

  // Check and update non-final transactions
  const updatedTransactions = await Promise.all(
    result.map(async (transaction) => {
      // Check non-final transactions to Midtrans API
      if (!["success", "failure"].includes(transaction.status)) {
        const statusResponse = await getTransactionStatus(transaction.id);
        if (statusResponse.success && statusResponse.data) {
          // Update the transaction object with latest status
          return {
            ...transaction,
            status: statusResponse.data.status,
            paymentMethod:
              statusResponse.data.paymentType || transaction.paymentMethod,
          };
        }
      }
      return transaction;
    }),
  );

  return updatedTransactions;
});
