"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import {
  authUsers,
  packages,
  referrals,
  schools,
  transactions,
} from "@/db/drizzle/schema";
import { desc, eq } from "drizzle-orm";
import { cache } from "react";
import { getTransactionStatus } from "../get-transaction-status";

export type GetAllTransactionsResponse = Awaited<
  ReturnType<typeof getAllTransactions>
>;

export const getAllTransactions = cache(async function () {
  const db = createDrizzleConnection();

  const result = await db
    .select({
      id: transactions.id,
      createdAt: transactions.createdAt,
      updatedAt: transactions.updatedAt,
      status: transactions.status,
      paymentMethod: transactions.paymentMethod,
      billedAmount: transactions.billedAmount,
      packageName: packages.name,
      userName: authUsers.email,
      referralCode: referrals.code,
      schoolName: schools.name,
    })
    .from(transactions)
    .leftJoin(packages, eq(packages.id, transactions.packageId))
    .leftJoin(authUsers, eq(authUsers.id, transactions.userId))
    .leftJoin(referrals, eq(referrals.id, transactions.referralId))
    .leftJoin(schools, eq(schools.id, transactions.schoolId))
    .orderBy(desc(transactions.createdAt));

  const finalStates = ["success", "failure"];

  // Check status for all non-final transactions
  await Promise.all(
    result
      .filter((transaction) => !finalStates.includes(transaction.status))
      .map(async (transaction) => {
        const statusCheck = await getTransactionStatus(transaction.id);
        if (statusCheck.success && statusCheck.data) {
          transaction.status = statusCheck.data.status;
          transaction.paymentMethod = statusCheck.data.paymentType;
        }
      }),
  );

  return result;
});
