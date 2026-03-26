import prisma from "../lib/prisma.js";
import { queryTransaction } from "../integrations/interswitch.api.js";
import * as reconciliationService from "../services/reconciliation.service.js";

/**
 * 🔁 Reconciliation Job
 */
const runReconciliation = async () => {
  console.log("🕒 Running reconciliation job...");

  try {
    // 1. Get all PENDING transactions
    const pendingTransactions = await prisma.transaction.findMany({
      where: {
        merchantStatus: "PENDING",
      },
    });

    if (!pendingTransactions.length) {
      console.log("✅ No pending transactions");
      return;
    }

    console.log(`🔍 Found ${pendingTransactions.length} pending transactions`);

    // 2. Loop through each transaction
    for (const txn of pendingTransactions) {
      try {
        console.log(`🔎 Checking ${txn.transactionRef}`);

        // ⚠️ amount must be in kobo
        const amountInKobo = txn.amount * 100;

        // 3. Query Interswitch
        const result = await queryTransaction(
          txn.transactionRef,
          amountInKobo
        );

        console.log(`📡 Interswitch says: ${result.status}`);

        // 4. Update issuerStatus
        const updatedTxn = await prisma.transaction.update({
          where: { transactionRef: txn.transactionRef },
          data: {
            issuerStatus: result.status,
          },
        });

        // 5. Detect anomaly
        if (
          result.status === "SUCCESS" &&
          updatedTxn.merchantStatus !== "CONFIRMED"
        ) {
          console.log(`⚠️ Anomaly detected for ${txn.transactionRef}`);

          await prisma.transaction.update({
            where: { transactionRef: txn.transactionRef },
            data: { anomalyDetected: true },
          });

          // 6. Trigger resolution
          await reconciliationService.resolveTransaction(updatedTxn);
        }

        // 7. Optional: mark failed transactions
        if (result.status === "FAILED") {
          await prisma.transaction.update({
            where: { transactionRef: txn.transactionRef },
            data: {
              merchantStatus: "FAILED",
            },
          });
        }
      } catch (err) {
        console.error(
          `❌ Error processing ${txn.transactionRef}:`,
          err.message
        );
      }
    }
  } catch (error) {
    console.error("❌ Reconciliation job failed:", error.message);
  }
};

module.exports = runReconciliation;