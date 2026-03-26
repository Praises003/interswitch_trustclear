// services/analytics.service.js

import prisma from "../lib/prisma.js";

export const getChargebackAnalytics = async () => {
  const totalComplaints = await prisma.complaint.count();

  const falseComplaints = await prisma.complaint.count({
    where: { isFalse: true },
  });

  const topOffenders = await prisma.complaint.groupBy({
    by: ["userId"],
    where: { isFalse: true },
    _count: true,
    orderBy: {
      _count: {
        userId: "desc",
      },
    },
    take: 5,
  });

  return {
    totalComplaints,
    falseComplaints,
    fraudRate: (falseComplaints / totalComplaints) * 100 || 0,
    topOffenders,
  };
};