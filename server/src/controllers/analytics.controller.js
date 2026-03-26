// controllers/analytics.controller.js

import * as analyticsService from "../services/analytics.service.js";

export const getAnalytics = async (req, res) => {
  const users = await analyticsService.getUserFraudAnalytics();

  res.json({
    totalUsers: users.length,
    users,
  });
};