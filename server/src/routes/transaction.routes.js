
import express from "express";
const router = express.Router();
import * as transactionController from "../controllers/transaction.controller.js";


import * as dashboardController from "../controllers/dashboard.controller.js";
import * as webhookController from "../controllers/webhook.controller.js";
const { getDashboardStats } = dashboardController;

// ✅ Transaction routes
router.get("/", transactionController.getAllTransactions);
router.post("/", transactionController.createTransaction);
router.get("/stats", getDashboardStats);
router.get("/:ref", transactionController.getTransaction);
router.delete("/reset", transactionController.resetTransactions); // NEW route to reset all transactions

// ✅ Webhook route
router.post("/webhook", webhookController.handleWebhook);


export default router;