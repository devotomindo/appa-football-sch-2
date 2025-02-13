"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { referrals, transactions, userProfiles } from "@/db/drizzle/schema";
import { and, count, desc, eq, getTableColumns } from "drizzle-orm";
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
    })
    .from(referrals)
    .leftJoin(userProfiles, eq(referrals.referrerId, userProfiles.id))
    .leftJoin(
      transactions,
      and(
        eq(transactions.referralId, referrals.id),
        eq(transactions.status, "settlement"),
      ),
    )
    .orderBy(desc(referrals.createdAt))
    .groupBy(referrals.id, userProfiles.name);
});
