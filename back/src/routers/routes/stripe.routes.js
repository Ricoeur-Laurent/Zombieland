import express from "express";
import { createCheckoutSession } from "../../controllers/stripeControllers.js";
import { verifyToken } from "../../middlewares/verifyToken.js";

const router = express.Router();

// Création d'une session de paiement
router.post("/", verifyToken, createCheckoutSession);

export default router;
