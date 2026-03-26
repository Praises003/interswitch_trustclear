import "./job/reconciliation.job.js"; // 👈 this starts the cron
import express from "express";
import cors from "cors";
import morgan from "morgan";

import transactionRoutes from "./routes/transaction.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

const app = express();
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:5173', "https://interswitch-trustclear.onrender.com"],
    credentials: true,    
  };

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/transactions", transactionRoutes);
app.use("/api/v1/complaints", complaintRoutes)
app.use("/api/v1/analytics", analyticsRoutes)

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Trust-Clear API running 🚀"
  });
});

export default app;