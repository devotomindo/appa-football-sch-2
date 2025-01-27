"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import {
  assessments,
  gradeMetrics,
  proPlayerAssessments,
} from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getAllProPlayerAssessmentById(proPlayerId: string) {
  const db = createDrizzleConnection();

  return await db
    .select({
      id: proPlayerAssessments.id,
      proPlayerId: proPlayerAssessments.proPlayerId,
      assessmentId: proPlayerAssessments.assessmentId,
      score: proPlayerAssessments.score,
      assessmentName: assessments.name,
      isHigherGradeBetter: assessments.isHigherGradeBetter,
      gradeMetric: gradeMetrics.metric,
      gradeMetricId: assessments.gradeMetricId,
    })
    .from(proPlayerAssessments)
    .where(eq(proPlayerAssessments.proPlayerId, proPlayerId))
    .leftJoin(
      assessments,
      eq(proPlayerAssessments.assessmentId, assessments.id),
    )
    .leftJoin(gradeMetrics, eq(assessments.gradeMetricId, gradeMetrics.id));
}
