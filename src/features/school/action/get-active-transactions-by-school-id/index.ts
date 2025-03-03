"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { packages, transactions } from "@/db/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { cache } from "react";

export type ActiveTransaction = {
  id: string;
  purchaseDate: Date;
  expiryDate: Date;
  packageName: string;
  quota: number;
  daysRemaining: number;
};

export type GetActiveTransactionsBySchoolIdResponse = ActiveTransaction[];

export const getActiveTransactionsBySchoolId = cache(async function (
  schoolId: string,
): Promise<GetActiveTransactionsBySchoolIdResponse> {
  const db = createDrizzleConnection();
  const currentDate = new Date();

  // Get all successful transactions with their packages
  const transactionsWithPackages = await db
    .select({
      id: transactions.id,
      updatedAt: transactions.updatedAt,
      packageName: packages.name,
      packageQuota: packages.quotaAddition,
      packageMonthDuration: packages.monthDuration,
    })
    .from(transactions)
    .leftJoin(packages, eq(transactions.packageId, packages.id))
    .where(
      and(
        eq(transactions.schoolId, schoolId),
        eq(transactions.status, "success"), // Only settled transactions
      ),
    );

  // Filter and transform transactions to include validity information
  const activeTransactions = transactionsWithPackages
    .map((transaction) => {
      const purchaseDate = new Date(transaction.updatedAt);

      // Calculate expiration date by adding months
      const expiryDate = new Date(purchaseDate);
      expiryDate.setMonth(
        expiryDate.getMonth() + Number(transaction.packageMonthDuration),
      );

      // Only include non-expired transactions
      if (expiryDate > currentDate) {
        // Calculate days remaining
        const daysRemaining = Math.ceil(
          (expiryDate.getTime() - currentDate.getTime()) /
            (1000 * 60 * 60 * 24),
        );

        return {
          id: transaction.id,
          purchaseDate,
          expiryDate,
          packageName: transaction.packageName,
          quota: Number(transaction.packageQuota),
          daysRemaining,
        };
      }
      return null;
    })
    .filter(Boolean) as ActiveTransaction[];

  return activeTransactions;
});
