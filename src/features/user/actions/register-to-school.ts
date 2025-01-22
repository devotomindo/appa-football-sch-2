"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { schoolRoleMembers } from "@/db/drizzle/schema";
import { and, eq } from "drizzle-orm";
import { v7 as uuidv7 } from "uuid";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { authGuard } from "../guards/auth-guard";

export async function registerToSchool(prevState: any, formData: FormData) {
  // VALIDATION
  const validationResult = await zfd
    .formData({
      roleId: zfd.numeric(z.number().int().positive()),
      schoolId: zfd.text(z.string().uuid()),
    })
    .safeParseAsync(formData);

  // validasi error
  if (!validationResult.success) {
    const errorFormatted = validationResult.error.format() as any;

    return {
      error: {
        general: undefined,
        roleId: errorFormatted.roleId?._errors,
        schoolId: errorFormatted.schoolId?._errors,
      },
    };
  }

  try {
    const db = createDrizzleConnection();
    let result: any;

    await db.transaction(async (tx) => {
      const userData = (await authGuard()).data;

      if (!userData) {
        result = {
          error: {
            general: "User tidak ditemukan",
          },
        };
        return;
      }

      // Validation Data
      const schoolId = validationResult.data.schoolId;
      const roleId = validationResult.data.roleId;

      // Check for existing records
      const existingMember = await tx.query.schoolRoleMembers.findFirst({
        where: and(
          eq(schoolRoleMembers.userId, userData.id),
          eq(schoolRoleMembers.schoolId, schoolId),
        ),
      });

      if (existingMember) {
        if (existingMember.isApproved) {
          result = {
            error: {
              general: "Anda sudah terdaftar di sekolah tersebut",
            },
          };
          return;
        } else {
          result = {
            error: {
              general:
                "Anda sudah mengajukan pendaftaran. Silahkan tunggu konfirmasi dari pihak sekolah",
            },
          };
          return;
        }
      }

      // Generate uuidv7 for schoolRoleMembers
      const id = uuidv7();

      // Insert to schoolRoleMembers
      await tx.insert(schoolRoleMembers).values({
        id,
        userId: userData.id,
        schoolId,
        schoolRoleId: roleId,
        isApproved: false,
      });

      result = {
        message: "Berhasil mengajukan pendaftaran ke sekolah",
      };
    });

    return result;
  } catch (error) {
    console.error(error);
    return {
      error: {
        general: "Gagal mendaftar ke sekolah",
      },
    };
  }
}
