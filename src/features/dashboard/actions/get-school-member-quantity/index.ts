"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import {
  schoolRoleMembers,
  schoolRoles,
  userProfiles,
} from "@/db/drizzle/schema";
import { calculateAge } from "@/lib/utils/age";
import { and, eq } from "drizzle-orm";
import { cache } from "react";

export const getSchoolMemberQuantity = cache(async function (schoolId: string) {
  const db = createDrizzleConnection();

  const data = await db
    .select({
      userId: schoolRoleMembers.userId,
      schoolRolesId: schoolRoleMembers.schoolRoleId,
      schoolRoles: schoolRoles.name,
      isApproved: schoolRoleMembers.isApproved,
      name: userProfiles.name,
      birthDate: userProfiles.birthDate,
    })
    .from(schoolRoleMembers)
    .where(
      and(
        eq(schoolRoleMembers.schoolId, schoolId),
        eq(schoolRoleMembers.isApproved, true),
      ),
    )
    .leftJoin(schoolRoles, eq(schoolRoles.id, schoolRoleMembers.schoolRoleId))
    .rightJoin(userProfiles, eq(userProfiles.id, schoolRoleMembers.userId));

  return data.reduce(
    (acc, item) => {
      // Count coaches
      if (item.schoolRoles?.toLowerCase().includes("coach")) {
        return {
          ...acc,
          totalPelatih: acc.totalPelatih + 1,
        };
      }

      // Count players by age groups
      const age = calculateAge(new Date(item.birthDate));
      if (age >= 5 && age <= 8) {
        return { ...acc, pemainKU58: acc.pemainKU58 + 1 };
      } else if (age >= 9 && age <= 12) {
        return { ...acc, pemainKU912: acc.pemainKU912 + 1 };
      } else if (age >= 13 && age <= 15) {
        return { ...acc, pemainKU1315: acc.pemainKU1315 + 1 };
      } else if (age >= 16 && age <= 18) {
        return { ...acc, pemainKU1618: acc.pemainKU1618 + 1 };
      }

      return acc;
    },
    {
      totalPelatih: 0,
      pemainKU58: 0,
      pemainKU912: 0,
      pemainKU1315: 0,
      pemainKU1618: 0,
    },
  );
});
