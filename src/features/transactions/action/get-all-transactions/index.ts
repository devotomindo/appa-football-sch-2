"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import {
  authUsers,
  packages,
  referrals,
  schools,
  transactions,
} from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";
import { cache } from "react";

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
    .leftJoin(schools, eq(schools.id, transactions.schoolId));

  return result;
});
