import * as webhookService from "../services/webhook.service.js";

export const handleWebhook = async (req, res) => {
  try {
    const payload = req.body;

    await webhookService.handleWebhook(payload);

    res.status(200).json({
      message: "Webhook processed successfully",
    });
  } catch (error) {
    console.error("Webhook error:", error.message);

    res.status(500).json({
      message: "Webhook processing failed",
      error: error.message,
    });
  }
};