"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { authUsers, userProfiles } from "@/db/drizzle/schema";
import { getUserRolesCTE } from "@/features/user/utils/get-user-roles-cte";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { cache } from "react";

export type GetAllUserResponse = Awaited<ReturnType<typeof getAllUser>>;

export const getAllUser = cache(async function () {
  const db = createDrizzleConnection();

  const userRolesCTE = getUserRolesCTE(db);

  return await db
    .with(userRolesCTE)
    .select({
      username: sql<string>`SPLIT_PART(${authUsers.email}, '@', 1)`,
      ...getTableColumns(userProfiles),
      userRole: sql<
        { id: number; name: string }[]
      >`COALESCE(${userRolesCTE.roles}, '{}')`,
      schools: sql<
        {
          id: string;
          name: string;
          role: string;
        }[]
      >`
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', s.id,
                'name', s.name,
                'role', sr.name
              )
            )
            FROM school_role_members srm
            JOIN schools s ON s.id = srm.school_id
            JOIN school_roles sr ON sr.id = srm.school_role_id
            WHERE srm.user_id = ${authUsers.id}
            AND srm.is_approved = true
          ),
          '[]'
        )
      `,
    })
    .from(authUsers)
    .innerJoin(userProfiles, eq(authUsers.id, userProfiles.id))
    .innerJoin(userRolesCTE, eq(authUsers.id, userRolesCTE.userId));
});
