
import prisma from "../lib/prisma.js";
import * as interswitchApi from "../integrations/interswitch.api.js";
import * as  fraudService from "./fraud.service.js";
import * as refundService from "./refund.service.js";

const normalizeStatus = (status) => {
  if (status === "00" || status === "SUCCESS") return "SUCCESS";
  if (status === "FAILED") return "FAILED";
  return "PENDING";
};

/**
 * Run fallback reconciliation
 */
export const runReconciliation = async () => {
  const transactions = await prisma.transaction.findMany({
    where: {
      // 1. ONLY fetch transactions that haven't been resolved yet
      resolutionStatus: null, 
      
      // 2. AND have an uncertain state
      AND: [
        {
          OR: [
            { merchantStatus: { not: "CONFIRMED" } },
            { issuerStatus: "PENDING" },
          ],
        }
      ]
    },
  });

  for (const txn of transactions) {
    try {
      const amountInKobo = txn.amount * 100;
      // 1. Query Interswitch
      const searchResult = await interswitchApi.queryTransaction(
        txn.transactionRef,
        amountInKobo
      );
      const issuerStatus = normalizeStatus(searchResult.status);
      console.log(`🔍 Reconciliation check for ${txn.transactionRef}: ${issuerStatus}`);

      const recentTransactions = await prisma.transaction.findMany({
        where: {
          id: txn.id,
          createdAt: {
            gte: new Date(Date.now() - 60 * 1000),
          },
        },
      });

      // 2. Re-run fraud detection
        const {
            fraudScore,
            potentialFraud,
            riskLevel,
            reasons
          } = await fraudService.evaluate(
            {
              ...txn,
              issuerStatus,
              userId: txn.userId
            },
            {
              recentTransactions
            }
    );

      const isAnomaly =
        issuerStatus === "SUCCESS" &&
        txn.merchantStatus !== "CONFIRMED";

        // If Interswitch says it failed or is still pending, and the merchant doesn't have it... it's just an abandoned checkout.
      const isAbandoned = issuerStatus === "FAILED" && txn.merchantStatus !== "CONFIRMED";

      // 3. Update everything ONCE
      const updatedTxn = await prisma.transaction.update({
        where: { transactionRef: txn.transactionRef },
        data: {
          issuerStatus,
          fraudScore,
          potentialFraud,
          riskLevel,
          fraudReasons: reasons.join(", "),
          anomalyDetected: isAnomaly,
          // 🔥 Autonomously dismiss abandoned transactions so they stop looping!
          resolutionStatus: txn.resolutionStatus // don't touch it here
        },
      });

      // 4. Handle anomaly
      if (isAnomaly) {
        console.log(`⚠️ Anomaly detected (reconciliation) for ${txn.transactionRef}`);
        await resolveTransaction(updatedTxn);
      }

      // 5. Handle Abandoned (The Cleanup)
      else if (isAbandoned) {
        console.log(`🗑️ Checkout abandoned for ${txn.transactionRef}. Marked as EXPIRED.`);
      }

    } catch (err) {
      console.error(`❌ Error processing ${txn.transactionRef}:`, err.message);
    }
  }
};

/**
 * Resolve anomaly safely
 */
export const resolveTransaction = async (transaction) => {
  console.log(`🔧 Resolving transaction ${transaction.transactionRef}`);

  // 🚨 Prevent duplicate refunds
  if (transaction.resolutionStatus === "REFUNDED") {
    console.log("⚠️ Already refunded, skipping...");
    return;
  }

  await prisma.transaction.update({
    where: { transactionRef: transaction.transactionRef },
    data: { resolutionStatus: "REFUND_REQUIRED" },
  });

  // 💸 Trigger refund
  await refundService.createRefund(transaction);
};