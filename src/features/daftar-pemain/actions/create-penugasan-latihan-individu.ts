"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { trainingProcedureAssignment } from "@/db/drizzle/schema";
import { v7 as uuidv7 } from "uuid";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function createPenugasanLatihanIndividu(
  prevState: any,
  formData: FormData,
) {
  const validationResult = await zfd
    .formData({
      trainingId: zfd.text(z.string().uuid()),
      studentId: zfd.text(z.string().uuid()),
    })
    .safeParseAsync(formData);

  if (!validationResult.success) {
    const errorFormatted = validationResult.error.format() as any;
    return {
      error: {
        general:
          errorFormatted.studentId?._errors ||
          errorFormatted.trainingId?._errors,
      },
    };
  }

  try {
    let result: any;
    const db = createDrizzleConnection();

    await db.transaction(async (tx) => {
      await tx.insert(trainingProcedureAssignment).values({
        id: uuidv7(),
        trainingId: validationResult.data.trainingId,
        studentId: validationResult.data.studentId,
      });

      result = {
        message: "Berhasil menugaskan latihan",
      };

      return;
    });

    return result;
  } catch (error) {
    console.log(error);
    return {
      error: {
        general: "Gagal menugaskan latihan",
      },
    };
  }
}
