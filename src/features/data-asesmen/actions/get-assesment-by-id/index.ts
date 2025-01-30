"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import {
  assessmentCategories,
  assessments,
  gradeMetrics,
} from "@/db/drizzle/schema";
import { getImageURL } from "@/features/ensiklopedi-posisi-pemain/utils/image-uploader";
import { eq } from "drizzle-orm";

export async function getAssessmentById(id: string) {
  const db = createDrizzleConnection();

  return await db
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
    .where(eq(assessments.id, id))
    .limit(1)
    .then(async (res) => {
      const { assessment, grademetricName, categoryName } = res[0];

      if (assessment.illustrationPath) {
        const imageUrls: string[] = await Promise.all<string>(
          assessment.illustrationPath.map((item: string) => getImageURL(item)),
        );
        return {
          ...assessment,
          grademetricName,
          categoryName,
          illustrationUrls: imageUrls,
        };
      }

      return {
        ...assessment,
        categoryName,
        grademetricName,
        illustrationUrls: [],
      };
    });
}
