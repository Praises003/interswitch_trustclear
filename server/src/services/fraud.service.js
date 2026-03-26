// services/fraud.service.js

import prisma from "../lib/prisma.js";

export const evaluate = async (txn) => {
  let score = 0;
  let reasons = [];

  // EXISTING RULES
  if (txn.amount > 500000) {
    score += 20;
    reasons.push("High transaction amount");
  }

  if (txn.issuerStatus === "SUCCESS" && txn.merchantStatus !== "CONFIRMED") {
    score += 40;
    reasons.push("Issuer success but merchant not confirmed");
  }

  // 🔥 NEW: USER BEHAVIOR RULE
  const falseCount = await prisma.complaint.count({
    where: {
      userId: txn.userId,
      isFalse: true,
    },
  });

  if (falseCount >= 2) {
    score += 60;
    reasons.push("User flagged for chargeback abuse");
  } else if (falseCount === 1) {
    score += 25;
    reasons.push("User has suspicious complaint history");
  }

  // FINAL LEVEL
  let riskLevel = "LOW";
  if (score >= 70) riskLevel = "HIGH";
  else if (score >= 40) riskLevel = "MEDIUM";

  return {
    fraudScore: score,
    potentialFraud: score >= 50,
    riskLevel,
    reasons,
  };
};