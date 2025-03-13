"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import {
  packages,
  schoolRoleMembers,
  schoolRoles,
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

  // Get role information and school from studentId
  const memberInfo = await db
    .select({
      schoolId: schoolRoleMembers.schoolId,
      roleName: schoolRoles.name,
    })
    .from(schoolRoleMembers)
    .leftJoin(schoolRoles, eq(schoolRoleMembers.schoolRoleId, schoolRoles.id))
    .where(eq(schoolRoleMembers.id, studentId))
    .limit(1);

  if (!memberInfo.length) {
    return {
      isPremium: false,
      premiumAssignmentId: null,
      premiumExpiresAt: null,
    };
  }

  const { schoolId, roleName } = memberInfo[0];
  const isCoachingRole = roleName === "Coach" || roleName === "Head Coach";

  if (isCoachingRole) {
    // For coaching roles, check school's latest successful transaction
    const schoolTransaction = await db
      .select({
        transactionUpdatedAt: transactions.updatedAt,
        packageMonthDuration: packages.monthDuration,
      })
      .from(transactions)
      .leftJoin(packages, eq(transactions.packageId, packages.id))
      .where(
        and(
          eq(transactions.schoolId, schoolId),
          eq(transactions.status, "success"),
        ),
      )
      .orderBy(transactions.updatedAt)
      .limit(1);

    if (
      schoolTransaction.length === 0 ||
      !schoolTransaction[0].transactionUpdatedAt
    ) {
      return {
        isPremium: false,
        premiumAssignmentId: null,
        premiumExpiresAt: null,
      };
    }

    const transaction = schoolTransaction[0];
    const transactionDate = new Date(transaction.transactionUpdatedAt);
    const expiryDate = new Date(transactionDate);
    expiryDate.setMonth(
      expiryDate.getMonth() + Number(transaction.packageMonthDuration || 0),
    );

    const isPremium = expiryDate > currentDate;

    return {
      isPremium,
      premiumAssignmentId: null, // Coaches don't have premium assignments
      premiumExpiresAt: isPremium ? expiryDate : null,
    };
  }

  // For students, use existing premium assignment logic
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
