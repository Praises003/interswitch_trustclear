// controllers/analytics.controller.js

import * as analyticsService from "../services/analytics.service.js";

export const getAnalytics = async (req, res) => {
  const data = await analyticsService.getChargebackAnalytics();
  res.json(data);
};