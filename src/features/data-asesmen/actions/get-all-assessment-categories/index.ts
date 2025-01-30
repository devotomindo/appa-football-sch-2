"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { assessmentCategories } from "@/db/drizzle/schema";
import { cache } from "react";

export type GetAllAssessmentCategoriesResponse = Awaited<
  ReturnType<typeof getAllAssessmentCategories>
>;

export const getAllAssessmentCategories = cache(async function () {
  const db = createDrizzleConnection();

  return await db
    .select({
      id: assessmentCategories.id,
      name: assessmentCategories.name,
    })
    .from(assessmentCategories);
});
