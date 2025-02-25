"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { transactions } from "@/db/drizzle/schema";
import { eq } from "drizzle-orm";

export async function updateTransactionStatus(
  transactionId: string,
  status: string,
  paymentMethod?: string,
) {
  const db = createDrizzleConnection();

  try {
    await db
      .update(transactions)
      .set({
        status: status,
        paymentMethod: paymentMethod,
        updatedAt: new Date(),
      })
      .where(eq(transactions.id, transactionId));

    // If payment successful, you might want to:
    // 1. Update school quota
    // 2. Process referral commission
    // 3. Send email notification
    if (status === "success") {
      // Implement additional business logic here
      // You can create separate server actions for each process
    }

    return {
      success: true,
      message: "Transaction status updated successfully",
    };
  } catch (error) {
    console.error("Error updating transaction status:", error);
    return {
      error: {
        general: "Failed to update transaction status",
      },
    };
  }
}
