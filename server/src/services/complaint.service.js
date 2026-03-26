import prisma from "../lib/prisma.js";
export const fileComplaint = async ({ transactionRef, userId, reason }) => {
  const tx = await prisma.transaction.findUnique({ where: { transactionRef } });
  if (!tx) throw new Error("Transaction not found");

  const isFalse = tx.issuerStatus === "SUCCESS" && tx.merchantStatus === "CONFIRMED";

  const complaint = await prisma.complaint.create({
    data: {
      transactionRef,
      userId,
      reason,
      isFalse,
    },
  });

  if (!userId) {
    console.log("⚠️ Skipping false complaint count (no userId)");
    return { complaint, meta: { isFalse, falseCount: null, userRiskLevel: "UNKNOWN" } };
  }

  // ✅ Only run count if userId exists
  const falseCount = await prisma.complaint.count({
    where: { userId, isFalse: true },
  });

  let userRiskLevel = "LOW";
  if (falseCount >= 2) userRiskLevel = "HIGH";
  else if (falseCount === 1) userRiskLevel = "MEDIUM";

  return { complaint, meta: { isFalse, falseCount, userRiskLevel } };
};