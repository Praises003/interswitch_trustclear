import nodeCron from "node-cron";
import * as reconciliationService from "../services/reconciliation.service.js"; 

// Run every 1 minute (for demo)
// In production, use */5 or */10
nodeCron.schedule("*/30 * * * * *", async () => {
  console.log("⏳ Running reconciliation job...");

  try {
    await reconciliationService.runReconciliation();
    console.log("✅ Reconciliation completed");
  } catch (error) {
    console.error("❌ Reconciliation error:", error.message);
  }
});