"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import {
  trainingProcedure,
  trainingProcedureAssignment,
} from "@/db/drizzle/schema";
import { createServerClient } from "@/db/supabase/server";
import { getStorageBucketAndPath } from "@/lib/utils/supabase";
import { and, eq } from "drizzle-orm";
import { cache } from "react";

export const getPenugasanLatihanIndividuByStudentId = cache(async function (
  studentId: string,
) {
  const db = createDrizzleConnection();
  const supabase = await createServerClient();

  const assignments = await db
    .select({
      id: trainingProcedure.id,
      name: trainingProcedure.name,
      procedure: trainingProcedure.procedure,
      minFieldSize: trainingProcedure.minFieldSize,
      videoPath: trainingProcedure.videoPath,
      groupSize: trainingProcedure.groupSize,
      description: trainingProcedure.description,
      createdAt: trainingProcedure.createdAt,
      updatedAt: trainingProcedure.updatedAt,
      assignmentId: trainingProcedureAssignment.id,
      assignmentCreatedAt: trainingProcedureAssignment.createdAt,
    })
    .from(trainingProcedureAssignment)
    .innerJoin(
      trainingProcedure,
      eq(trainingProcedureAssignment.trainingId, trainingProcedure.id),
    )
    .where(
      and(
        eq(trainingProcedureAssignment.studentId, studentId),
        eq(trainingProcedure.groupSize, 1),
      ),
    )
    .orderBy(trainingProcedureAssignment.createdAt);

  return assignments.map((training) => {
    const { bucket, path } = getStorageBucketAndPath(training.videoPath);
    const videoUrl = supabase.storage.from(bucket).getPublicUrl(path);

    return {
      id: training.id,
      name: training.name,
      procedure: training.procedure,
      minFieldSize: training.minFieldSize,
      groupSize: training.groupSize,
      description: training.description,
      createdAt: training.createdAt,
      updatedAt: training.updatedAt,
      videoUrl: videoUrl.data.publicUrl,
      // // Additional assignment-specific fields
      // assignmentId: training.assignmentId,
      // assignmentCreatedAt: training.assignmentCreatedAt,
    };
  });
});

export type GetPenugasanLatihanIndividuByStudentIdResponse = Awaited<
  ReturnType<typeof getPenugasanLatihanIndividuByStudentId>
>;
