"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { tools } from "@/db/drizzle/schema";
import { createServerClient } from "@/db/supabase/server";
import { authGuard } from "@/features/user/guards/auth-guard";
import { isUserAdmin } from "@/features/user/utils/is-user-admin";
import { getStorageBucketAndPath } from "@/lib/utils/supabase";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zfd } from "zod-form-data";

export async function deleteTool(prevState: any, formData: FormData) {
  const validationResult = await zfd
    .formData({
      id: zfd.text(z.string().uuid()),
    })
    .safeParseAsync(formData);

  if (!validationResult.success) {
    const errorFormatted = validationResult.error.format() as any;

    return {
      error: {
        general: errorFormatted.id?._errors,
      },
    };
  }

  try {
    const db = createDrizzleConnection();
    const supabase = await createServerClient();
    let result: any;
    await db.transaction(async (tx) => {
      // Start of Admin Check
      const userData = (await authGuard()).data;

      if (!userData) {
        result = {
          error: {
            general: "User not found",
          },
        };

        return;
      }

      // Verify is Admin
      const isAdmin = isUserAdmin(userData);
      if (!isAdmin) {
        result = {
          error: {
            general: "Unauthorized",
          },
        };

        return;
      }
      // End of Admin Check

      // Delete tool
      const { id } = validationResult.data;
      const deletedTool = await tx
        .delete(tools)
        .where(eq(tools.id, id))
        .returning({ imagePath: tools.imagePath })
        .then((res) => res[0]);

      if (deletedTool.imagePath) {
        const { bucket, path } = getStorageBucketAndPath(deletedTool.imagePath);

        await supabase.storage.from(bucket).remove([path]);
      }

      // On success
      result = {
        success: true,
        message: "Berhasil menghapus alat latihan",
      };
    });

    return result;
  } catch (error: any) {
    return {
      error: {
        general:
          error.message || "Terjadi kesalahan saat menghapus alat latihan",
      },
    };
  }
}
