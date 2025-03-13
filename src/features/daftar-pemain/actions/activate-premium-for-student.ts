"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import {
  packages,
  schoolRoleMembers,
  studentPremiumAssignments,
  transactions,
} from "@/db/drizzle/schema";
import { and, count, eq, isNotNull, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { v7 as uuidv7 } from "uuid";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function activatePremium(prevState: any, formData: FormData) {
  const validationResult = await zfd
    .formData({
      studentId: zfd.text(z.string().uuid()),
      schoolId: zfd.text(z.string().uuid()),
    })
    .safeParseAsync(formData);

  if (!validationResult.success) {
    const errorFormatted = validationResult.error.format() as any;
    return {
      error: {
        general:
          errorFormatted._errors ||
          errorFormatted.studentId?._errors ||
          errorFormatted.schoolId?._errors,
      },
    };
  }

  try {
    let result: any;
    const db = createDrizzleConnection();

    await db.transaction(async (tx) => {
      const studentId = validationResult.data.studentId;
      const schoolId = validationResult.data.schoolId;

      // Verify the student exists and belongs to the school
      const student = await tx
        .select({
          id: schoolRoleMembers.id,
        })
        .from(schoolRoleMembers)
        .where(
          and(
            eq(schoolRoleMembers.id, studentId),
            eq(schoolRoleMembers.schoolId, schoolId),
            eq(schoolRoleMembers.isApproved, true),
          ),
        )
        .limit(1);

      if (student.length === 0) {
        result = {
          error: {
            general:
              "Siswa tidak ditemukan atau tidak terdaftar di sekolah ini",
          },
        };
        return;
      }

      // Check if student already has active premium status
      const existingPremium = await tx
        .select({
          id: studentPremiumAssignments.id,
        })
        .from(studentPremiumAssignments)
        .where(
          and(
            eq(studentPremiumAssignments.studentId, studentId),
            isNull(studentPremiumAssignments.deactivatedAt),
          ),
        )
        .limit(1);

      if (existingPremium.length > 0) {
        result = {
          error: {
            general: "Siswa sudah memiliki status premium",
          },
        };
        return;
      }

      const currentDate = new Date();

      // Get all valid transactions with their usage counts
      const schoolTransactions = await tx
        .select({
          id: transactions.id,
          updatedAt: transactions.updatedAt,
          packageQuota: packages.quotaAddition,
          packageMonthDuration: packages.monthDuration,
        })
        .from(transactions)
        .leftJoin(packages, eq(transactions.packageId, packages.id))
        .where(
          and(
            eq(transactions.schoolId, schoolId),
            eq(transactions.status, "success"),
          ),
        );

      // Filter expired transactions and calculate usage for each transaction
      const transactionUsage = await Promise.all(
        schoolTransactions.map(async (transaction) => {
          // Skip if missing data
          if (!transaction.updatedAt || !transaction.packageMonthDuration) {
            return null;
          }

          // Calculate expiration date
          const transactionDate = new Date(transaction.updatedAt);
          const expiryDate = new Date(transactionDate);
          expiryDate.setMonth(
            expiryDate.getMonth() + Number(transaction.packageMonthDuration),
          );

          // Skip expired transactions
          if (expiryDate <= currentDate) {
            return null;
          }

          // Get usage count for this transaction
          const usedCount = await tx
            .select({
              count: count(),
            })
            .from(studentPremiumAssignments)
            .where(
              and(
                eq(studentPremiumAssignments.transactionId, transaction.id),
                isNull(studentPremiumAssignments.deactivatedAt),
              ),
            );

          const usedQuota = Number(usedCount[0]?.count || 0);
          const totalQuota = Number(transaction.packageQuota || 0);

          return {
            transactionId: transaction.id,
            usedQuota,
            totalQuota,
            availableQuota: totalQuota - usedQuota,
            expiryDate,
          };
        }),
      );

      if (transactionUsage.length === 0) {
        result = {
          error: {
            general:
              "Tidak ada transaksi pembelian paket premium yang valid. Silakan beli paket baru.",
          },
        };
        return;
      }

      // Find all transactions with available quota, sorted by oldest first
      const validTransactions = transactionUsage
        .filter(Boolean) // Remove null entries
        .filter((t) => t && t.availableQuota > 0)
        .sort((a, b) => a!.expiryDate.getTime() - b!.expiryDate.getTime());

      if (validTransactions.length === 0) {
        result = {
          error: {
            general:
              "Tidak ada kuota premium tersedia. Silakan beli paket baru.",
          },
        };
        return;
      }

      // Find a transaction that hasn't been used by this student before
      let usableTransaction;
      for (const transaction of validTransactions) {
        const isDeactivated = await tx
          .select({
            id: studentPremiumAssignments.id,
          })
          .from(studentPremiumAssignments)
          .where(
            and(
              eq(studentPremiumAssignments.studentId, studentId),
              eq(
                studentPremiumAssignments.transactionId,
                transaction!.transactionId,
              ),
              isNotNull(studentPremiumAssignments.deactivatedAt),
            ),
          );

        if (isDeactivated.length === 0) {
          usableTransaction = transaction;
          break;
        }
      }

      if (!usableTransaction) {
        result = {
          error: {
            general:
              "Tidak ada paket yang tersedia untuk siswa ini. Silakan beli paket baru.",
          },
        };
        return;
      }

      // Assign premium status to student
      await tx.insert(studentPremiumAssignments).values({
        id: uuidv7(),
        studentId: studentId,
        transactionId: usableTransaction.transactionId,
        createdAt: new Date(),
      });

      result = {
        message: "Berhasil mengaktifkan status premium untuk siswa",
      };
    });

    // Invalidate the cache
    revalidatePath("/dashboard/daftar-pemain");

    return result;
  } catch (error) {
    console.error("Error activating premium:", error);
    return {
      error: {
        general: "Gagal mengaktifkan status premium. Silakan coba lagi nanti.",
      },
    };
  }
}
