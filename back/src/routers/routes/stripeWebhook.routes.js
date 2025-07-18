import bodyParser from "body-parser";
import express from "express";
import { handleStripeWebhook } from "../../controllers/stripeControllers.js";

const router = express.Router();

// Webhook Stripe → nécessite le "raw body"
router.post(
	"/webhook",
	bodyParser.raw({ type: "application/json" }),
	handleStripeWebhook,
);

export default router;
