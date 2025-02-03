"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import {
  assessmentCategories,
  assessmentSessions,
  assessments,
} from "@/db/drizzle/schema";
import { and, eq } from "drizzle-orm";

export type GetAssessmentSessionBySchoolIdAndCompletionStatusParams = {
  schoolId: string;
  isCompleted?: boolean;
};

export type GetAssessmentSessionBySchoolIdAndCompletionStatusResponse = {
  id: string;
  createdAt: Date;
  schoolId: string;
  assessmentId: string;
  isCompleted: boolean;
  assessment: {
    name: string | null;
    category: string | null;
  };
}[];

export async function getAssessmentSessionBySchoolIdAndCompletionStatus({
  schoolId,
  isCompleted,
}: GetAssessmentSessionBySchoolIdAndCompletionStatusParams) {
  const db = createDrizzleConnection();

  const conditions = [eq(assessmentSessions.schoolId, schoolId)];

  if (typeof isCompleted === "boolean") {
    conditions.push(eq(assessmentSessions.isCompleted, isCompleted));
  }

  const result = await db
    .select({
      id: assessmentSessions.id,
      createdAt: assessmentSessions.createdAt,
      schoolId: assessmentSessions.schoolId,
      assessmentId: assessmentSessions.assessmentId,
      isCompleted: assessmentSessions.isCompleted,
      assessment: {
        name: assessments.name,
        category: assessmentCategories.name,
      },
    })
    .from(assessmentSessions)
    .leftJoin(assessments, eq(assessmentSessions.assessmentId, assessments.id))
    .leftJoin(
      assessmentCategories,
      eq(assessments.categoryId, assessmentCategories.id),
    )
    .where(and(...conditions));

  return result.map((item) => ({
    ...item,
    assessment: {
      name: item.assessment.name ?? null,
      category: item.assessment.category ?? null,
    },
  }));
}
