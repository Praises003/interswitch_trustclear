// controllers/complaint.controller.js

import * as complaintService from "../services/complaint.service.js";

export const fileComplaint = async (req, res) => {
  try {
    const { transactionRef, userId, reason } = req.body;

    if (!transactionRef || !userId || !reason) {
      return res.status(400).json({
        message: "transactionRef, userId and reason are required",
      });
    }

    const result = await complaintService.fileComplaint({
      transactionRef,
      userId,
      reason,
    });

    return res.status(201).json({
      message: "Complaint submitted successfully",
      data: result,
    });
  } catch (err) {
    console.error("❌ Complaint Error:", err.message);

    return res.status(500).json({
      message: err.message || "Something went wrong",
    });
  }
};