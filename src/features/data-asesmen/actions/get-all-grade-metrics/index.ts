"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { gradeMetrics } from "@/db/drizzle/schema";
import { cache } from "react";

export type getAllGradeMetricsResponse = Awaited<
  ReturnType<typeof getAllGradeMetrics>
>;

export const getAllGradeMetrics = cache(async function () {
  const db = createDrizzleConnection();

  return await db
    .select({
      id: gradeMetrics.id,
      name: gradeMetrics.metric,
    })
    .from(gradeMetrics);
});
