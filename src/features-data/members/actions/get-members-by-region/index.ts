"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { schoolRoleMembers, states, userProfiles } from "@/db/drizzle/schema";
import { count, desc, eq, sql } from "drizzle-orm";
import { cache } from "react";

export interface MemberRegionData {
  regionName: string;
  memberCount: number;
  headCoachCount: number;
  coachCount: number;
  athleteCount: number;
}

export const getMembersByRegion = cache(async function () {
  const db = createDrizzleConnection();

  try {
    // Using db.select with conditional counts for each role
    const result = await db
      .select({
        regionName: states.name,
        memberCount: count(schoolRoleMembers.userId),
        headCoachCount: count(
          sql`CASE WHEN ${schoolRoleMembers.schoolRoleId} = 1 THEN 1 ELSE NULL END`,
        ),
        coachCount: count(
          sql`CASE WHEN ${schoolRoleMembers.schoolRoleId} = 2 THEN 1 ELSE NULL END`,
        ),
        athleteCount: count(
          sql`CASE WHEN ${schoolRoleMembers.schoolRoleId} = 3 THEN 1 ELSE NULL END`,
        ),
      })
      .from(schoolRoleMembers)
      .where(eq(schoolRoleMembers.isApproved, true))
      .leftJoin(userProfiles, eq(schoolRoleMembers.userId, userProfiles.id))
      .leftJoin(states, eq(userProfiles.domisiliProvinsi, states.id))
      .groupBy(states.name)
      .orderBy(desc(count(schoolRoleMembers.userId)));
    console.log(result);

    if (result && result.length > 0) {
      return result
        .filter((item) => item.regionName !== null) // Filter out null region names
        .map((item) => {
          return {
            regionName: item.regionName
              ? item.regionName.split(" ").join("")
              : "Unknown",
            memberCount: item.memberCount,
            headCoachCount: item.headCoachCount,
            coachCount: item.coachCount,
            athleteCount: item.athleteCount,
          };
        });
    }
  } catch (error) {
    {
      console.error("Database query error:", error);
      console.error("Database query error:", error);
    }
  }
});
