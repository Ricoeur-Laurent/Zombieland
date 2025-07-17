import dotenv from "dotenv";

dotenv.config();

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import seed from "./src/migration/seed.js";
import { initDatabase } from "./src/migration/sync.js";
import router from "./src/routers/router.js";
import stripeRouter from "./src/routers/routes/stripe.routes.js";
import stripeWebhookRouter from "./src/routers/routes/stripeWebhook.routes.js";

const app = express();

const corsOptions = {
	origin: ["http://localhost:3000", "http://localhost:3001"],
	credentials: true,
	methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
};
app.use(cors(corsOptions));
//stripe webhook must come before the body parsers
// Stripe requires the raw body for webhook signature verification
app.use("/api/stripe", stripeWebhookRouter);
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/stripe", stripeRouter);
app.use("/api", router);
const PORT = process.env.PORT || 5000;

async function startServer() {
	try {
		await initDatabase();
		await seed();
		app.listen(PORT, () => {
			console.log(`Server running on http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error("Erreur au démarrage :", error);
		process.exit(1);
	}
}

startServer();
