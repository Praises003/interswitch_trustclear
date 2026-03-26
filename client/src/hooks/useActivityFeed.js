import { useEffect, useRef, useState } from "react";
import useTransactions from "./useTransactions";

export default function useActivityFeed() {
  const { transactions } = useTransactions();

  const [events, setEvents] = useState([]);
  const prevTransactions = useRef([]);

  useEffect(() => {
    console.log("Transactions updated:", transactions);
    const prev = prevTransactions.current;

    // ✅ FIRST LOAD — generate REAL events (not just "loaded")
    if (prev.length === 0 && transactions.length > 0) {
      const initialEvents = transactions.slice(0, 8).map((tx) => {
        console.log("Processing tx on first load:", tx);
        
        if (tx.resolutionStatus === "REFUNDED") {
          return {
            id: crypto.randomUUID(),
            message: `💸 Refund issued — ${tx.transactionRef}${
          tx.fraudReasons ? `\nReasons: ${tx.fraudReasons}` : ""}`,
          };
        }

        if (tx.anomalyDetected) {
          return {
            id: crypto.randomUUID(),
            message: `⚠️ Anomaly detected — ${tx.transactionRef}${
          tx.fraudReasons ? `\nReasons: ${tx.fraudReasons}` : ""}`,
          };
        }

        if (tx.potentialFraud) {
          return {
            id: crypto.randomUUID(),
            message: `🚨 Fraud risk (${tx.riskLevel}) — ${tx.transactionRef}${
          tx.fraudReasons ? `\nReasons: ${tx.fraudReasons}` : ""}`,
          };
        }

        return {
          id: crypto.randomUUID(),
          message: `🆕 Transaction ${tx.transactionRef}${
          tx.fraudReasons ? `\nReasons: ${tx.fraudReasons}` : ""}`,
        };
      });

      setEvents(initialEvents);
      prevTransactions.current = transactions;
      return;
    }

    // ✅ NORMAL FLOW — detect CHANGES (your original logic)
    const newEvents = [];

    transactions.forEach((tx) => {
      const oldTx = prev.find((p) => p.id === tx.id);

      if (!oldTx) {
        newEvents.push({
          id: crypto.randomUUID(),
          message: `🆕 New transaction ${tx.transactionRef}${
          tx.fraudReasons ? `\nReasons: ${tx.fraudReasons}` : ""}`,
        });
        return;
      }

      if (!oldTx.anomalyDetected && tx.anomalyDetected) {
        newEvents.push({
          id: crypto.randomUUID(),
          message: `⚠️ Anomaly detected — ${tx.transactionRef}${
          tx.fraudReasons ? `\nReasons: ${tx.fraudReasons}` : ""}`,
        });
      }

      if (oldTx.fraudScore !== tx.fraudScore) {
        newEvents.push({
          id: crypto.randomUUID(),
          message: `🤖 Fraud score updated (${tx.fraudScore}) — ${tx.transactionRef}${
          tx.fraudReasons ? `\nReasons: ${tx.fraudReasons}` : ""}`,
        });
      }

      if (
        oldTx.resolutionStatus !== "REFUNDED" &&
        tx.resolutionStatus === "REFUNDED"
      ) {
        newEvents.push({
          id: crypto.randomUUID(),
          message: `💸 Refund issued — ${tx.transactionRef}${
          tx.fraudReasons ? `\nReasons: ${tx.fraudReasons}` : ""}`,
        });
      }
    });

    if (newEvents.length > 0) {
      setEvents((prevEvents) => [...newEvents, ...prevEvents].slice(0, 20));
    }

    prevTransactions.current = transactions;
  }, [transactions]);

  return events;
}