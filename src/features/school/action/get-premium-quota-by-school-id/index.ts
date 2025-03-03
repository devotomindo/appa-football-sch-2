"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import {
  packages,
  studentPremiumAssignments,
  transactions,
} from "@/db/drizzle/schema";
import { and, eq, isNull } from "drizzle-orm";
import { cache } from "react";

export type GetPremiumQuotaBySchoolIdResponse = {
  totalQuota: number;
  usedQuota: number;
  availableQuota: number;
};

export const getPremiumQuotaBySchoolId = cache(async function (
  schoolId: string,
): Promise<GetPremiumQuotaBySchoolIdResponse> {
  const db = createDrizzleConnection();
  const currentDate = new Date();

  // Get valid transactions with their packages
  const validTransactions = await db
    .select({
      transactionId: transactions.id,
      transactionUpdatedAt: transactions.updatedAt,
      packageQuota: packages.quotaAddition,
      packageMonthDuration: packages.monthDuration,
    })
    .from(transactions)
    .leftJoin(packages, eq(transactions.packageId, packages.id))
    .where(
      and(
        eq(transactions.schoolId, schoolId),
        eq(transactions.status, "success"), // Only count successful transactions
      ),
    );

  // Calculate total quota from non-expired transactions
  let totalQuota = 0;
  for (const transaction of validTransactions) {
    // Check if the transaction date is valid before proceeding
    if (!transaction.transactionUpdatedAt) continue;

    const transactionDate = new Date(transaction.transactionUpdatedAt);
    // Calculate expiration date by adding months to the transaction date
    const expiryDate = new Date(transactionDate);
    expiryDate.setMonth(
      expiryDate.getMonth() + Number(transaction.packageMonthDuration || 0),
    );

    // Only count quota if transaction hasn't expired yet
    if (expiryDate > currentDate) {
      totalQuota += Number(transaction.packageQuota || 0);
    }
  }

  // Get all premium assignments with their transaction details to count active ones
  const premiumAssignments = await db
    .select({
      studentId: studentPremiumAssignments.studentId,
      transactionId: studentPremiumAssignments.transactionId,
      transactionUpdatedAt: transactions.updatedAt,
      packageMonthDuration: packages.monthDuration,
    })
    .from(studentPremiumAssignments)
    .leftJoin(
      transactions,
      eq(studentPremiumAssignments.transactionId, transactions.id),
    )
    .leftJoin(packages, eq(transactions.packageId, packages.id))
    .where(
      and(
        eq(transactions.status, "success"),
        isNull(studentPremiumAssignments.deactivatedAt),
      ),
    );

  // Count active premium assignments
  let usedQuota = 0;
  for (const assignment of premiumAssignments) {
    // Check if the transaction date is valid before proceeding
    if (!assignment.transactionUpdatedAt) continue;

    const transactionDate = new Date(assignment.transactionUpdatedAt);
    const expiryDate = new Date(transactionDate);
    expiryDate.setMonth(
      expiryDate.getMonth() + Number(assignment.packageMonthDuration || 0),
    );

    // Only count as used quota if the assignment is still active (not expired)
    if (expiryDate > currentDate) {
      usedQuota++;
    }
  }

  return {
    totalQuota,
    usedQuota,
    availableQuota: totalQuota - usedQuota,
  };
});
