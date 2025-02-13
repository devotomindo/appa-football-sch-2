"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import {
  assessmentRecords,
  assessmentSessions,
  assessments,
  gradeMetrics,
  schoolRoleMembers,
} from "@/db/drizzle/schema";
import { and, eq, inArray, isNotNull } from "drizzle-orm";
import { cache } from "react";

export type getAssessmentScoresWithStudentIdResponse = Awaited<
  ReturnType<typeof getAssessmentScoresWithStudentId>
>;

export const getAssessmentScoresWithStudentId = cache(async function (
  studentId: string,
) {
  const db = createDrizzleConnection();

  // 1. Get user id and school id of student
  const student = await db
    .select({
      userId: schoolRoleMembers.userId,
      schoolId: schoolRoleMembers.schoolId,
    })
    .from(schoolRoleMembers)
    .where(eq(schoolRoleMembers.id, studentId))
    .limit(1)
    .then((result) => result[0]);

  // 2. Get base assessment records
  const records = await db
    .select({
      id: assessmentRecords.id,
      score: assessmentRecords.score,
      assessmentSessionId: assessmentRecords.assessmentSessionId,
    })
    .from(assessmentRecords)
    .where(eq(assessmentRecords.studentId, student.userId));

  if (!records.length) return [];

  // 3. Get all related sessions
  const sessions = await db
    .select({
      id: assessmentSessions.id,
      createdAt: assessmentSessions.createdAt,
      assessmentId: assessmentSessions.assessmentId,
    })
    .from(assessmentSessions)
    .where(
      and(
        inArray(
          assessmentSessions.id,
          records.map((r) => r.assessmentSessionId),
        ),
        eq(assessmentSessions.schoolId, student.schoolId),
        isNotNull(assessmentSessions.completedAt),
      ),
    );

  const sessionMap = new Map(sessions.map((s) => [s.id, s]));

  // 4. Get all related assessments with grade metrics
  const assessmentData = await db
    .select({
      id: assessments.id,
      name: assessments.name,
      isHigherGradeBetter: assessments.isHigherGradeBetter,
      gradeMetricId: assessments.gradeMetricId,
    })
    .from(assessments)
    .where(
      inArray(
        assessments.id,
        sessions.map((s) => s.assessmentId),
      ),
    );

  // 5. Get grade metrics if needed
  const metricsData = await db
    .select({
      id: gradeMetrics.id,
      metric: gradeMetrics.metric,
    })
    .from(gradeMetrics)
    .where(
      inArray(
        gradeMetrics.id,
        assessmentData
          .map((a) => a.gradeMetricId)
          .filter((id): id is string => id !== null),
      ),
    );

  const metricsMap = new Map(metricsData.map((m) => [m.id, m]));
  const assessmentMap = new Map(assessmentData.map((a) => [a.id, a]));

  // Combine everything and sort by session createdAt, then calculate personal best
  const recordsByAssessment = new Map<string, (typeof records)[0][]>();

  // Group records by assessment ID
  records
    .filter((record) => sessionMap.has(record.assessmentSessionId))
    .forEach((record) => {
      const session = sessionMap.get(record.assessmentSessionId)!;
      const assessmentId = session.assessmentId;

      if (!recordsByAssessment.has(assessmentId)) {
        recordsByAssessment.set(assessmentId, []);
      }
      recordsByAssessment.get(assessmentId)!.push(record);
    });

  return records
    .filter((record) => sessionMap.has(record.assessmentSessionId))
    .map((record) => {
      const session = sessionMap.get(record.assessmentSessionId)!;
      const assessment = assessmentMap.get(session.assessmentId)!;
      const gradeMetric = assessment.gradeMetricId
        ? metricsMap.get(assessment.gradeMetricId)
        : null;

      // Calculate personal best for this assessment
      const assessmentRecords = recordsByAssessment.get(assessment.id) ?? [];
      const personalBest = assessmentRecords.reduce((best, current) => {
        if (!best.score || !current.score) return best;
        if (assessment.isHigherGradeBetter) {
          return current.score > best.score ? current : best;
        }
        return current.score < best.score ? current : best;
      });

      return {
        id: record.id,
        score: record.score,
        isPersonalBest: record.id === personalBest.id,
        assessmentSession: {
          createdAt: session.createdAt,
          assessment: {
            id: assessment.id,
            name: assessment.name ?? "",
            isHigherGradeBetter: assessment.isHigherGradeBetter,
            gradeMetric: gradeMetric ? { metric: gradeMetric.metric } : null,
          },
        },
      };
    })
    .sort(
      (a, b) =>
        new Date(b.assessmentSession.createdAt).getTime() -
        new Date(a.assessmentSession.createdAt).getTime(),
    );
});
