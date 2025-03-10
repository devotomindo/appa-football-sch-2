"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import {
  assessmentCategories,
  assessmentIllustrations,
  assessments,
  assessmentTools,
  gradeMetrics,
  tools,
} from "@/db/drizzle/schema";
import { createServerClient } from "@/db/supabase/server";
import { getStorageBucketAndPath } from "@/lib/utils/supabase";
import { eq } from "drizzle-orm";

export async function getAssessmentById(id: string) {
  const db = createDrizzleConnection();
  const supabase = await createServerClient();

  // First, get the base assessment information
  const assessmentData = await db
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
    .then((res) => res[0]);

  // Separately fetch all tools related to this assessment
  const toolsData = await db
    .select({
      id: tools.id,
      name: tools.name,
      imagePath: tools.imagePath,
      minCount: assessmentTools.minCount,
    })
    .from(assessmentTools)
    .leftJoin(tools, eq(tools.id, assessmentTools.toolId))
    .where(eq(assessmentTools.assessmentId, id));

  // Process tool images
  const processedTools = await Promise.all(
    toolsData.map(async (tool) => {
      if (tool.imagePath) {
        const { bucket, path } = getStorageBucketAndPath(tool.imagePath);
        const imageUrl = supabase.storage.from(bucket).getPublicUrl(path);
        return {
          ...tool,
          imageUrl: imageUrl.data.publicUrl,
        };
      }
      return {
        ...tool,
        imageUrl: null,
      };
    }),
  );

  // Fetch illustrations
  const illustrations = await db
    .select()
    .from(assessmentIllustrations)
    .where(eq(assessmentIllustrations.assessmentId, id))
    .orderBy(assessmentIllustrations.orderNumber);

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

  // Return combined data
  return {
    ...assessmentData.assessment,
    tools: processedTools,
    categoryName: assessmentData.categoryName,
    grademetricName: assessmentData.grademetricName,
    illustrations: illustrationUrls,
  };
}
