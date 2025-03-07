"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import {
  packages,
  studentPremiumAssignments,
  transactions,
} from "@/db/drizzle/schema";
import { and, eq, isNull } from "drizzle-orm";
import { cache } from "react";

export type IsCurrentStudentPremiumResponse = Awaited<
  ReturnType<typeof isCurrentStudentPremium>
>;

export const isCurrentStudentPremium = cache(async function (
  studentId: string,
) {
  // Return non-premium status immediately if studentId is empty or invalid
  if (!studentId || studentId.trim() === "") {
    return {
      isPremium: false,
      premiumAssignmentId: null,
      premiumExpiresAt: null,
    };
  }

  const db = createDrizzleConnection();
  const currentDate = new Date();

  // Get premium assignment with transaction details for the specific student
  const premiumAssignment = await db
    .select({
      id: studentPremiumAssignments.id,
      transactionId: studentPremiumAssignments.transactionId,
      transactionUpdatedAt: transactions.updatedAt,
      transactionStatus: transactions.status,
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
        eq(studentPremiumAssignments.studentId, studentId),
        isNull(studentPremiumAssignments.deactivatedAt),
        eq(transactions.status, "success"),
      ),
    )
    .orderBy(transactions.updatedAt) // Get the most recent transaction first
    .limit(1);

  // No premium assignment found
  if (premiumAssignment.length === 0) {
    return {
      isPremium: false,
      premiumAssignmentId: null,
      premiumExpiresAt: null,
    };
  }

  const assignment = premiumAssignment[0];

  // Skip if transaction date is missing
  if (!assignment.transactionUpdatedAt) {
    return {
      isPremium: false,
      premiumAssignmentId: null,
      premiumExpiresAt: null,
    };
  }

  // Calculate expiration date (transaction date + months duration)
  const transactionDate = new Date(assignment.transactionUpdatedAt);
  const expiryDate = new Date(transactionDate);
  expiryDate.setMonth(
    expiryDate.getMonth() + Number(assignment.packageMonthDuration || 0),
  );

  // Check if transaction is still valid (not expired)
  const isPremium = expiryDate > currentDate;

  return {
    isPremium,
    premiumAssignmentId: isPremium ? assignment.id : null,
    premiumExpiresAt: isPremium ? expiryDate : null,
  };
});
