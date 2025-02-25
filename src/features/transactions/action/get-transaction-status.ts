"use server";

import { createDrizzleConnection } from "@/db/drizzle/connection";
import { transactions } from "@/db/drizzle/schema";
import { createMidtransClient } from "@/lib/utils/midtrans";
import dayjs from "dayjs";
import { eq } from "drizzle-orm";
import { updateTransactionStatus } from "./update-transaction-status";

export async function getTransactionStatus(orderId: string) {
  try {
    // First check local transaction status
    const db = createDrizzleConnection();
    const localTransaction = await db
      .select({
        status: transactions.status,
        paymentMethod: transactions.paymentMethod,
        createdAt: transactions.createdAt,
      })
      .from(transactions)
      .where(eq(transactions.id, orderId))
      .limit(1)
      .then((res) => res[0]);

    try {
      const midtransClient = createMidtransClient();
      const response = await midtransClient.transaction.status(orderId);

      const transactionStatus = response.transaction_status;
      const fraudStatus = response.fraud_status;

      let status: string;

      if (transactionStatus == "capture") {
        status = fraudStatus == "accept" ? "success" : "challenge";
      } else if (transactionStatus == "settlement") {
        status = "success";
      } else if (["cancel", "deny", "expire"].includes(transactionStatus)) {
        status = "failure";
      } else if (transactionStatus == "pending") {
        status = "pending";
      } else {
        status = "failure";
      }

      // Update local database status
      await updateTransactionStatus(orderId, status, response.payment_type);

      return {
        success: true,
        data: {
          status,
          paymentType: response.payment_type,
        },
      };
    } catch (midtransError) {
      // Check if transaction is initiated and old
      if (
        localTransaction.status === "initiated" &&
        dayjs().diff(dayjs(localTransaction.createdAt), "minute") > 15
      ) {
        // Update status to failure for old initiated transactions
        await updateTransactionStatus(orderId, "failure");
        return {
          success: true,
          data: {
            status: "failure",
            paymentType: localTransaction.paymentMethod,
          },
        };
      }

      // If Midtrans API returns 404, transaction might not be created yet
      // Just return the local status (Expected during initialization)
      console.warn("Midtrans status check failed:", midtransError);
      return {
        success: true,
        data: {
          status: localTransaction.status,
          paymentType: localTransaction.paymentMethod,
        },
      };
    }
  } catch (error) {
    console.error("Error checking transaction status:", error);
    return { error: "Failed to check transaction status" };
  }
}
