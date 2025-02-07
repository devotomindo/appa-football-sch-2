"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import {
  schoolRoleMembers,
  schoolRoles,
  userProfiles,
} from "@/db/drizzle/schema";
import { calculateAge } from "@/lib/utils/age";
import { eq } from "drizzle-orm";
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
    .where(eq(schoolRoleMembers.schoolId, schoolId))
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
        return { ...acc, pemainKU10: acc.pemainKU10 + 1 };
      } else if (age >= 9 && age <= 12) {
        return { ...acc, pemainKU13: acc.pemainKU13 + 1 };
      } else if (age >= 13 && age <= 15) {
        return { ...acc, pemainKU15: acc.pemainKU15 + 1 };
      } else if (age >= 16 && age <= 18) {
        return { ...acc, pemainKU17: acc.pemainKU17 + 1 };
      }

      return acc;
    },
    {
      totalPelatih: 0,
      pemainKU8: 0,
      pemainKU10: 0,
      pemainKU13: 0,
      pemainKU15: 0,
      pemainKU17: 0,
    },
  );
});
