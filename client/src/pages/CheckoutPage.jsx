// src/pages/CheckoutPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const API_BASE = "https://interswitch-trustclear-backend.onrender.com/api/v1/transactions";

export default function CheckoutPage() {
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("idle"); // idle | processing | success | failed
  const [details, setDetails] = useState(null);
  const [currentRef, setCurrentRef] = useState(null);
  const [scenario, setScenario] = useState("normal");

   const navigate = useNavigate();

  // Generate or retrieve persistent userId
  const getUserId = () => {
    let id = localStorage.getItem("userId");
    if (!id) {
      if (window.crypto && window.crypto.randomUUID) {
        id = window.crypto.randomUUID();
      } else {
        id =
          Date.now().toString(36) +
          Math.random().toString(36).substring(2);
      }
      localStorage.setItem("userId", id);
    }
    return id;
  };

  // Launch Interswitch checkout
  const payWithInterswitch = (txn) => {
    if (!txn.transactionRef || !txn.merchantCode || !txn.payItemId) {
      toast.error("Missing checkout details from backend");
      return;
    }

    window.webpayCheckout({
      merchant_code: txn.merchantCode,
      pay_item_id: txn.payItemId,
      txn_ref: txn.transactionRef,
      amount: txn.amount,
      currency: 566,
      site_redirect_url: window.location.href,

      onComplete: async (response) => {
        toast.success("Payment done. Simulating webhook...");
        setStatus("processing");

        const webhookStatus =
          response.resp === "00" ? "SUCCESS" : "FAILED";

        // ✅ wait for webhook
        await simulateWebhook(webhookStatus, txn.transactionRef);

        toast.dismiss();
        toast.success("Webhook processed");

        // ✅ fetch immediately (NO timeout)
        await fetchStatus(txn.transactionRef);
      },

      onClose: () => {
        toast("Payment window closed");
        setStatus("failed");
      },
    });
  };

  // Start payment process
  const startPayment = async () => {
    if (!amount) return toast.error("Enter amount");

    setStatus("processing");
    setDetails(null);

    const userId = getUserId();
    console.log(userId);

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(amount),
          scenario,
          userId,
        }),
      });

      const data = await res.json();
      const txn = data.data;

      if (!txn || !txn.transactionRef) {
        toast.error("Transaction creation failed");
        setStatus("failed");
        return;
      }

      setCurrentRef(txn.transactionRef);
      toast.loading("Opening payment gateway...");

      payWithInterswitch(txn);
    } catch (err) {
      console.error(err);
      toast.error("Payment failed to start");
      setStatus("failed");
    }
  };

  // Simulate webhook call
  const simulateWebhook = async (status, transactionRef) => {
    if (!transactionRef)
      return toast.error("Missing transactionRef for webhook");

    try {
      const res = await fetch(`${API_BASE}/webhook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionRef, status }),
      });

      if (!res.ok) {
        console.error("Webhook failed:", await res.text());
        toast.error("Webhook call failed");
      } else {
        console.log(`Webhook simulated: ${status}`);
      }
    } catch (err) {
      console.error("Webhook error", err);
      toast.error("Webhook call failed");
    }
  };

  // Fetch transaction status from backend
  const fetchStatus = async (ref) => {
    const transactionRef = ref || currentRef;

    if (!transactionRef)
      return toast.error(
        "Cannot fetch status: missing transactionRef"
      );

    console.log(transactionRef);

    try {
      const res = await fetch(`${API_BASE}/${transactionRef}`);
      if (!res.ok) throw new Error("Transaction not found");

      const txn = await res.json();
      setDetails(txn);

      if (txn.issuerStatus === "SUCCESS") {
        setStatus("success");
        toast.success("Transaction Successful");
      } else {
        setStatus("failed");
        toast.error("Transaction Failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch transaction status");
      setStatus("failed");
    }
  };

  // File complaint
  const fileComplaint = async () => {
    const userId = getUserId();
    if (!currentRef)
      return toast.error("No transaction to file complaint");

    try {
      await fetch(`https://interswitch-trustclear-backend.onrender.com/api/v1/complaints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionRef: currentRef,
          userId,
          reason: "Debited but not confirmed",
        }),
      });
      toast("🚨 Complaint submitted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit complaint");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-indigo-900 flex items-center justify-center p-6">
      <Toaster position="top-right" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-3">
            💳 Smart Checkout
          </h1>

          <motion.button
            onClick={() => navigate("/")}
            className="px-5 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm backdrop-blur-md shadow-md"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
            whileTap={{ scale: 0.95 }}
          >
            ⬅️ Back to Dashboard
          </motion.button>
        </div>

        <input
          type="number"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 rounded-xl mb-4 bg-white text-black"
        />

        <select
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
          className="w-full p-3 rounded-xl mb-4 bg-white text-black"
        >
          <option value="normal">Normal Transaction</option>
          <option value="webhook_failure">Webhook Failure</option>
          <option value="merchant_failure">Merchant Failure</option>
        </select>

        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={startPayment}
          className="w-full bg-green-500 text-white py-3 rounded-xl font-bold"
        >
          Pay Now
        </motion.button>

        <div className="mt-6 text-center">
          <AnimatePresence mode="wait">
            {status === "processing" && (
              <motion.div className="text-yellow-400">
                🔄 Processing payment...
              </motion.div>
            )}
            {status === "success" && (
              <motion.div className="text-green-400 font-bold">
                ✅ Payment Successful
              </motion.div>
            )}
            {status === "failed" && (
              <motion.div className="text-red-400 font-bold">
                ❌ Payment Failed
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {details && (
          <motion.div className="mt-6 bg-black/40 p-4 rounded-xl text-white text-sm">
            <p>Ref: {details.transactionRef}</p>
            <p>Issuer: {details.issuerStatus}</p>
            <p>Merchant: {details.merchantStatus}</p>
            <p>Fraud: {details.potentialFraud ? "Yes" : "No"}</p>
            <p>Risk: {details.riskLevel}</p>
            <p>Reason: {details.fraudReasons}</p>
            <p>
              Resolution: {details.resolutionStatus || "NONE"}
            </p>
          </motion.div>
        )}

        {details && (
          <motion.button
            onClick={fileComplaint}
            className="w-full mt-4 bg-red-500 py-3 rounded-xl text-white font-bold"
          >
            🚨 Report Issue
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}