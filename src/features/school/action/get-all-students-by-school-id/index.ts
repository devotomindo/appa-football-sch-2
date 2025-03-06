"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import {
  packages,
  schoolRoleMembers,
  studentPremiumAssignments,
  transactions,
  userProfiles,
} from "@/db/drizzle/schema";
import { createServerClient } from "@/db/supabase/server";
import { calculateAge, getAgeGroup } from "@/lib/utils/age";
import { getStorageBucketAndPath } from "@/lib/utils/supabase";
import { and, eq, isNull } from "drizzle-orm";
import { cache } from "react";

export type GetAllStudentsBySchoolIdResponse = Awaited<
  ReturnType<typeof getAllStudentsBySchoolId>
>;

export const getAllStudentsBySchoolId = cache(async function (
  schoolId: string,
) {
  const db = createDrizzleConnection();
  const supabase = await createServerClient();
  const currentDate = new Date();

  // Get all approved students
  const studentsData = await db
    .select({
      id: schoolRoleMembers.id,
      createdAt: schoolRoleMembers.createdAt,
      userId: schoolRoleMembers.userId,
      userFullName: userProfiles.name,
      userAvatarPath: userProfiles.avatarPath,
      userUpdatedAt: userProfiles.updatedAt,
      userBirthDate: userProfiles.birthDate,
    })
    .from(schoolRoleMembers)
    .leftJoin(userProfiles, eq(schoolRoleMembers.userId, userProfiles.id))
    .where(
      and(
        eq(schoolRoleMembers.schoolId, schoolId),
        eq(schoolRoleMembers.isApproved, true),
        eq(schoolRoleMembers.schoolRoleId, 3),
      ),
    );

  // Get all premium assignments with their transaction details
  const premiumAssignments = await db
    .select({
      id: studentPremiumAssignments.id,
      studentId: studentPremiumAssignments.studentId,
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
        isNull(studentPremiumAssignments.deactivatedAt),
        eq(transactions.status, "success"),
      ),
    );

  // Create a map of student IDs to active premium assignment details
  const activePremiumAssignments = new Map();

  for (const assignment of premiumAssignments) {
    // Skip if transaction date is missing
    if (!assignment.transactionUpdatedAt) continue;

    // Calculate expiration date (transaction date + months duration)
    const transactionDate = new Date(assignment.transactionUpdatedAt);
    const expiryDate = new Date(transactionDate);
    expiryDate.setMonth(
      expiryDate.getMonth() + Number(assignment.packageMonthDuration || 0),
    );

    // Only consider as premium if transaction is still valid (not expired)
    if (expiryDate > currentDate) {
      activePremiumAssignments.set(assignment.studentId, {
        premiumAssignmentId: assignment.id,
        expiresAt: expiryDate,
      });
    }
  }

  return Promise.all(
    studentsData.map(async (student) => {
      const age = student.userBirthDate
        ? calculateAge(new Date(student.userBirthDate))
        : null;
      const ageGroup = age ? getAgeGroup(age) : null;

      // Check if this student has an active premium assignment
      const premiumDetails = activePremiumAssignments.get(student.id);
      const isPremium = !!premiumDetails;
      const premiumAssignmentId = premiumDetails?.premiumAssignmentId || null;
      const premiumExpiresAt = premiumDetails?.expiresAt || null;

      if (!student.userAvatarPath) {
        return { 
          ...student, 
          userImageUrl: null, 
          age, 
          ageGroup, 
          isPremium, 
          premiumAssignmentId,
          premiumExpiresAt 
        };
      }

      const { bucket, path } = getStorageBucketAndPath(student.userAvatarPath);
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      const userImageUrl =
        data.publicUrl +
        (student.userUpdatedAt ? `?t=${new Date(student.userUpdatedAt)}` : "");

      return {
        ...student,
        userImageUrl,
        age,
        ageGroup,
        isPremium,
        premiumAssignmentId,
        premiumExpiresAt
      };
    }),
  );
});
