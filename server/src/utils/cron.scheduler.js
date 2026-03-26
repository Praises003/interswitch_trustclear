;
import nodeCron from "node-cron";
import { runReconciliation } from "../services/reconciliation.service";

// Runs every 30 seconds (perfect for demo)
nodeCron.schedule("*/30 * * * * *", async () => {
  console.log("⏰ Cron triggered...");
  await runReconciliation();
});