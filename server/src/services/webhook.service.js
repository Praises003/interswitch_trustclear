import prisma from "../lib/prisma.js";
import * as reconciliationService from "./reconciliation.service.js";
import * as fraudService from "./fraud.service.js";

const normalizeStatus = (status) => {
  if (status === "00" || status === "SUCCESS") return "SUCCESS";
  if (status === "FAILED") return "FAILED";
  return "PENDING";
};

export const handleWebhook = async (payload) => {
  const { transactionRef, status } = payload;

  const transaction = await prisma.transaction.findUnique({
    where: { transactionRef },
  });

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  const issuerStatus = normalizeStatus(status);

  // 🔴 Scenario: simulate webhook failure
  if (transaction.scenario === "webhook_failure") {
    console.log(`🔹 Webhook ignored intentionally for ${transactionRef}`);

    await prisma.transaction.update({
      where: { transactionRef },
      data: { issuerStatus },
    });

    return;
  }

  // 🟢 Merchant logic
  let merchantStatus =
    transaction.scenario === "merchant_failure"
      ? "FAILED"
      : "CONFIRMED";

  // 🤖 Fraud scoring
      const {
      fraudScore,
      potentialFraud,
      riskLevel,
      reasons
    } = await fraudService.evaluate({
      ...transaction,
      issuerStatus,
      merchantStatus,
    });

  const updatedTransaction = await prisma.transaction.update({
    where: { transactionRef },
    data: {
      issuerStatus,
      merchantStatus,
      fraudScore,
      potentialFraud,
      riskLevel,
      fraudReasons: reasons.join(", "),
    },
  });

  // 🚨 Anomaly detection
  if (
    updatedTransaction.issuerStatus === "SUCCESS" &&
    updatedTransaction.merchantStatus !== "CONFIRMED"
  ) {
    console.log(`⚠️ Anomaly detected for ${transactionRef}`);

    await prisma.transaction.update({
      where: { transactionRef },
      data: { anomalyDetected: true },
    });

    await reconciliationService.resolveTransaction(updatedTransaction);
  }

  return updatedTransaction;
};