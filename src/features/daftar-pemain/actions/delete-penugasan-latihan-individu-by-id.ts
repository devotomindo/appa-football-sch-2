"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { trainingProcedureAssignment } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function deletePenugasanLatihanIndividuById(
  prevState: any,
  formData: FormData,
) {
  const validationResult = await zfd
    .formData({
      assignmentId: zfd.text(z.string()),
      studentId: zfd.text(z.string()),
    })
    .safeParseAsync(formData);

  if (!validationResult.success) {
    const errorFormatted = validationResult.error.format() as any;

    return {
      error: {
        general: undefined,
        assignmentId: errorFormatted.assessmentId,
        studentId: errorFormatted.studentId,
      },
    };
  }

  console.log("validationResult", validationResult);
  console.log("validationResult.data", validationResult.data);

  const db = createDrizzleConnection();

  try {
    await db.transaction(async (tx) => {
      await tx
        .delete(trainingProcedureAssignment)
        .where(
          eq(
            trainingProcedureAssignment.id,
            validationResult.data.assignmentId,
          ),
        );
    });
  } catch (error: any) {
    console.error(error);
    return {
      error: {
        success: false,
        general: error.message,
      },
    };
  }

  revalidatePath(`/dashboard/daftar-pemain/${validationResult.data.studentId}`);
  revalidatePath("/dashboard/daftar-pemain");

  return {
    success: true,
    message: "Berhasil menghapus penugasan latihan",
  };
}
