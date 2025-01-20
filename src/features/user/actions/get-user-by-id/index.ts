"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { authUsers, userProfiles } from "@/db/drizzle/schema";
import { createServerClient } from "@/db/supabase/server";
import { getUserRolesCTE } from "@/features/user/utils/get-user-roles-cte";
import { getStorageBucketAndPath } from "@/lib/utils/supabase";
import { and, eq, getTableColumns, isNull, sql } from "drizzle-orm";
import { cache } from "react";

export type GetUserByIdResponse = Awaited<ReturnType<typeof getUserById>>;

export const getUserById = cache(async function (id: string) {
  const db = createDrizzleConnection();

  const userRolesCTE = getUserRolesCTE(db);

  const supabase = await createServerClient();

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
          id: number;
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
          ),
          '[]'
        )
      `,
    })
    .from(authUsers)
    .innerJoin(userProfiles, eq(authUsers.id, userProfiles.id))
    .leftJoin(userRolesCTE, eq(authUsers.id, userRolesCTE.userId))
    .where(and(eq(authUsers.id, id), isNull(userProfiles.deletedAt)))
    .limit(1)
    .then((res) => {
      const user = res[0];

      if (!user.avatarPath) {
        return user;
      }

      const { bucket, path } = getStorageBucketAndPath(user.avatarPath);

      // Fetch avatar from bucket
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);

      return {
        ...user,
        avatarUrl: data.publicUrl,
      };
    });
});
