// controllers/dashboard.controller.js
import prisma from "../lib/prisma.js";
export const getDashboardStats = async (req, res) => {
  try {
    const totalTransactions = await prisma.transaction.count();

    const successfulTransactions = await prisma.transaction.count({
      where: { issuerStatus: "SUCCESS", merchantStatus: "CONFIRMED" }
    });

    const pendingTransactions = await prisma.transaction.count({
      where: { issuerStatus: "PENDING" }
    });

    const anomaliesDetected = await prisma.transaction.count({
      where: { anomalyDetected: true }
    });

    const refundsIssued = await prisma.transaction.count({
      where: { resolutionStatus: "REFUNDED" }
    });

    const highRiskTransactions = await prisma.transaction.count({
      where: { riskLevel: "HIGH" }
    });

    // Sum up the total money saved/protected by the autonomous engine
    const protectedAggregation = await prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        resolutionStatus: { in: ["REFUND_REQUIRED", "REFUNDED"] },
      },
    });

    const revenueProtected = protectedAggregation._sum.amount || 0;

    res.json({
      totalTransactions,
      successfulTransactions,
      pendingTransactions,
      anomaliesDetected,
      refundsIssued,
      highRiskTransactions, 
      revenueProtected,
    });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: error.message });
  }
};