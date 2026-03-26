// services/analytics.service.js

import prisma from "../lib/prisma.js";

export const getUserFraudAnalytics = async () => {
  // 1. Get all users grouped
  const users = await prisma.complaint.groupBy({
    by: ["userId"],
    _count: {
      _all: true,
    },
  });

  console.log(users);

  const results = [];

  for (const user of users) {
    const userId = user.userId;

    // Total complaints
    const totalComplaints = await prisma.complaint.count({
      where: { userId },
    });

    // False complaints
    const falseComplaints = await prisma.complaint.count({
      where: { userId, isFalse: true },
    });

    // ✅ FRAUD SCORE LOGIC
    let fraudScore = 0;

    // Weight 1: False complaint ratio
    const falseRatio =
      totalComplaints > 0 ? falseComplaints / totalComplaints : 0;

    fraudScore += falseRatio * 60;

    // Weight 2: Frequency
    if (totalComplaints >= 5) fraudScore += 25;
    else if (totalComplaints >= 3) fraudScore += 15;
    else if (totalComplaints >= 1) fraudScore += 5;

    // Weight 3: Repeat abuse
    if (falseComplaints >= 3) fraudScore += 15;
    else if (falseComplaints >= 2) fraudScore += 10;

    fraudScore = Math.min(Math.round(fraudScore), 100);

    // ✅ RISK LEVEL
    let riskLevel = "LOW";
    if (fraudScore >= 70) riskLevel = "HIGH";
    else if (fraudScore >= 40) riskLevel = "MEDIUM";

    // ✅ FLAGS (THIS IS 🔥 FOR HACKATHON)
    const flags = [];

    if (falseComplaints >= 2) {
      flags.push("Multiple false complaints");
    }

    if (falseRatio > 0.7) {
      flags.push("High false complaint ratio");
    }

    if (totalComplaints >= 5) {
      flags.push("High complaint frequency");
    }

    results.push({
      userId,
      totalComplaints,
      falseComplaints,
      fraudScore,
      riskLevel,
      flags,
    });
  }

  return results.sort((a, b) => b.fraudScore - a.fraudScore);
};