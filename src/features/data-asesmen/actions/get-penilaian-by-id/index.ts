"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import {
  assessmentCategories,
  assessmentIllustrations,
  assessments,
  assessmentSessions,
  gradeMetrics,
} from "@/db/drizzle/schema";
import { createServerClient } from "@/db/supabase/server";
import { getStorageBucketAndPath } from "@/lib/utils/supabase";
import { eq } from "drizzle-orm";

export async function getPenilaianById(id: string) {
  const db = createDrizzleConnection();
  const supabase = await createServerClient();

  const assessmentId = await db
    .select({
      assessmentId: assessmentSessions.assessmentId,
    })
    .from(assessmentSessions)
    .where(eq(assessmentSessions.id, id))
    .limit(1)
    .then((res) => res[0].assessmentId);

  if (!assessmentId) {
    return null;
  }

  const assessment = await db
    .select({
      assessment: assessments,
      categoryName: assessmentCategories.name,
      grademetricName: gradeMetrics.metric,
    })
    .from(assessments)
    .leftJoin(gradeMetrics, eq(assessments.gradeMetricId, gradeMetrics.id))
    .leftJoin(
      assessmentCategories,
      eq(assessments.categoryId, assessmentCategories.id),
    )
    .where(eq(assessments.id, assessmentId))
    .limit(1)
    .then((res) => res[0]);

  const illustrations = await db
    .select()
    .from(assessmentIllustrations)
    .where(eq(assessmentIllustrations.assessmentId, assessmentId))
    .orderBy(assessmentIllustrations.orderNumber); // ascending

  const illustrationUrls = await Promise.all(
    illustrations.map(async (ill) => {
      const { bucket: imageBucket, path: imagePath } = getStorageBucketAndPath(
        ill.imagePath,
      );
      const imageUrl = supabase.storage
        .from(imageBucket)
        .getPublicUrl(imagePath);

      return {
        id: ill.id,
        imageUrl: imageUrl.data.publicUrl,
        procedure: ill.procedure,
      };
    }),
  );

  return {
    ...assessment.assessment,
    categoryName: assessment.categoryName,
    grademetricName: assessment.grademetricName,
    illustrations: illustrationUrls,
  };
}
