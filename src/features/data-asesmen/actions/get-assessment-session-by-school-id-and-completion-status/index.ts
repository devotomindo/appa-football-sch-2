"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import {
  assessmentCategories,
  assessmentSessions,
  assessments,
} from "@/db/drizzle/schema";
import { and, eq, isNotNull, isNull } from "drizzle-orm";

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
  completedAt: Date | null;
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
    // If isCompleted is true, we want completedAt to be NOT NULL
    // If isCompleted is false, we want completedAt to be NULL
    if (isCompleted) {
      conditions.push(isNotNull(assessmentSessions.completedAt));
    } else {
      conditions.push(isNull(assessmentSessions.completedAt));
    }
  }

  const result = await db
    .select({
      id: assessmentSessions.id,
      createdAt: assessmentSessions.createdAt,
      schoolId: assessmentSessions.schoolId,
      assessmentId: assessmentSessions.assessmentId,
      completedAt: assessmentSessions.completedAt,
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
    id: item.id,
    createdAt: item.createdAt,
    schoolId: item.schoolId,
    assessmentId: item.assessmentId,
    isCompleted: item.completedAt !== null,
    completedAt: item.completedAt,
    assessment: {
      name: item.assessment.name ?? null,
      category: item.assessment.category ?? null,
    },
  }));
}
