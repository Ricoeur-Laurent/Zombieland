import express from "express";
import { createCheckoutSession } from "../../controllers/stripeControllers.js";

const router = express.Router();

// Création d'une session de paiement
router.post("/", createCheckoutSession);

export default router;
