"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import {
  packages,
  referrals,
  referralsPackagesAssignments,
  transactions,
  userProfiles,
} from "@/db/drizzle/schema";
import { and, count, desc, eq, getTableColumns, sql } from "drizzle-orm";
import { cache } from "react";

export type GetAllReferralsResponse = Awaited<
  ReturnType<typeof getAllReferrals>
>;

export const getAllReferrals = cache(async function () {
  const db = createDrizzleConnection();

  return await db
    .select({
      ...getTableColumns(referrals),
      referrerName: userProfiles.name,
      usageCount: count(transactions.id),
      assignedPackages: sql<Array<{ id: string; name: string }>>`
        jsonb_agg(
          distinct jsonb_build_object(
            'id', ${packages.id},
            'name', ${packages.name}
          )
        ) filter (where ${packages.id} is not null)
      `.as("assigned_packages"),
    })
    .from(referrals)
    .leftJoin(userProfiles, eq(referrals.referrerId, userProfiles.id))
    .leftJoin(
      transactions,
      and(
        eq(transactions.referralId, referrals.id),
        eq(transactions.status, "success"),
      ),
    )
    .leftJoin(
      referralsPackagesAssignments,
      eq(referralsPackagesAssignments.referralId, referrals.id),
    )
    .leftJoin(packages, eq(referralsPackagesAssignments.packageId, packages.id))
    .orderBy(desc(referrals.createdAt))
    .groupBy(referrals.id, userProfiles.name);
});
