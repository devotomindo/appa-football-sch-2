"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import {
  assessmentCategories,
  assessments,
  gradeMetrics,
} from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getAssessmentsByCategory(categoryId: number | null) {
  const db = createDrizzleConnection();

  const query = db
    .select({
      id: assessments.id,
      name: assessments.name,
      description: assessments.description,
      mainGoal: assessments.mainGoal,
      isHigherGradeBetter: assessments.isHigherGradeBetter,
      categoryId: assessments.categoryId,
      categoryName: assessmentCategories.name,
      gradeMetric: gradeMetrics.metric,
    })
    .from(assessments)
    .leftJoin(
      assessmentCategories,
      eq(assessments.categoryId, assessmentCategories.id),
    )
    .leftJoin(gradeMetrics, eq(assessments.gradeMetricId, gradeMetrics.id));

  if (categoryId) {
    query.where(eq(assessments.categoryId, categoryId));
  }

  const data = await query;

  return data;
}
