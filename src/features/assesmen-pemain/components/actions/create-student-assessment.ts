"use server";
import { createDrizzleConnection } from "@/db/drizzle/connection";
import { assessmentRecords, assessmentSessions } from "@/db/drizzle/schema";
import { v7 as uuidv7 } from "uuid";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function createStudentAssessment(
  prevState: any,
  formData: FormData,
) {
  const validationResult = await zfd
    .formData({
      assessmentId: z.string().uuid(),
      studentIds: zfd.repeatable(z.array(z.string().uuid())),
    })
    .safeParseAsync(formData);

  if (!validationResult.success) {
    const errorFormatted = validationResult.error.format() as any;
    return {
      error: {
        general: errorFormatted.studentIds?._errors,
      },
    };
  }

  try {
    let result: any;
    const db = createDrizzleConnection();

    await db.transaction(async (tx) => {
      // Create Assessment Session Record
      const assessmentSessionId = await tx
        .insert(assessmentSessions)
        .values({
          id: uuidv7(),
          assessmentId: validationResult.data.assessmentId,
        })
        .returning({ id: assessmentSessions.id })
        .then((res) => res[0].id);

      // Insert Student Assessment Records concurrently
      await Promise.all(
        validationResult.data.studentIds.map((studentId: string) => {
          tx.insert(assessmentRecords).values({
            id: uuidv7(),
            studentId: studentId,
            assessmentSessionId: assessmentSessionId,
          });
        }),
      );

      result = {
        message: "Sesi Asesmen Dimulai",
        assessmentSessionId,
      };
    });

    return result;
  } catch (error) {
    console.error("Transaction error:", error); // Add this for debugging
    return {
      error: {
        general: "Terjadi kesalahan saat membuat sesi asesmen",
      },
    };
  }
}
