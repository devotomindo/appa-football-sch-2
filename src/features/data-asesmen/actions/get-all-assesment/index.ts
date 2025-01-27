"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { assessments, gradeMetrics } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";

export async function getAllAssessment() {
  const db = createDrizzleConnection();

  return await db
    .select({
      id: assessments.id,
      name: assessments.name,
      gradeMetric: gradeMetrics.metric,
      category: assessments.category,
    })
    .from(assessments)
    .leftJoin(gradeMetrics, eq(assessments.gradeMetricId, gradeMetrics.id));
}
