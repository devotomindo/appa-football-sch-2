"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { schoolRoleMembers } from "@/db/drizzle/schema";
import { authGuard } from "@/features/user/guards/auth-guard";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zfd } from "zod-form-data";

export const acceptSchoolRegistrant = async function (
  prevState: any,
  formData: FormData,
) {
  // VALIDATION
  const validationResult = await zfd
    .formData({
      memberId: zfd.text(z.string().uuid()),
    })
    .safeParseAsync(formData);

  // validasi error
  if (!validationResult.success) {
    const errorFormatted = validationResult.error.format() as any;

    return {
      error: {
        general: errorFormatted.memberId?._errors,
      },
    };
  }

  try {
    const db = createDrizzleConnection();
    const updateTime = new Date();
    let result: any; // Used to fetch errors and success message for notificaton

    await db.transaction(async (tx) => {
      // Get current user
      const userData = (await authGuard()).data;

      if (!userData) {
        result = {
          error: {
            general: "User tidak ditemukan",
          },
        };
        return;
      }

      // New School Data
      const memberId = validationResult.data.memberId;

      // Check if user is head of SSB
      const memberData = await tx.query.schoolRoleMembers.findFirst({
        where: (fields, { eq }) => eq(fields.id, memberId),
      });

      if (!memberData) {
        result = {
          error: {
            general: "Data member tidak ditemukan",
          },
        };
        return;
      }

      const isUserHead = await tx.query.schoolRoleMembers.findFirst({
        where: (fields, { and, eq }) =>
          and(
            eq(fields.userId, userData.id),
            eq(fields.schoolId, memberData.schoolId),
            eq(fields.schoolRoleId, 1),
            eq(fields.isApproved, true),
          ),
      });

      if (!isUserHead) {
        result = {
          error: {
            general: "Anda tidak memiliki akses untuk menerima anggota",
          },
        };
        return;
      }

      // Update member status to approved
      await tx
        .update(schoolRoleMembers)
        .set({
          isApproved: true,
          updatedAt: updateTime,
        })
        .where(eq(schoolRoleMembers.id, memberId));

      result = {
        message: "Berhasil menerima anggota",
      };
    });

    return result;
  } catch (error) {
    console.error(error);
    return {
      error: {
        general: "Gagal menerima anggota",
      },
    };
  }
};
