import Stripe from "stripe";
import { Reservations } from "../models/index.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: "2023-10-16",
});
export const createCheckoutSession = async (req, res) => {
	const { visit_date, nb_participants, calculated_price, userId } = req.body;

	try {
		console.log("💬 Body reçu :", req.body);
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			mode: "payment",
			line_items: [
				{
					price_data: {
						currency: "eur",
						product_data: {
							name: `Réservation du ${visit_date}`,
						},
						unit_amount: calculated_price * 100, // Stripe await cents
					},
					quantity: 1,
				},
			],
			metadata: {
				visit_date,
				nb_participants,
				userId,
				amount: calculated_price,
			},
			success_url: "http://localhost:3001/success",
			cancel_url: "http://localhost:3001/cancel",
		});

		res.status(200).json({ id: session.id });
	} catch (error) {
		console.error("❌ Erreur création session Stripe :", error.message);
		res.status(500).json({ error: "Erreur création session Stripe" });
	}
};

export async function handleStripeWebhook(req, res) {
	const sig = req.headers["stripe-signature"];
	const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

	let event;

	try {
		// Verify the Stripe webhook signature
		event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
	} catch (err) {
		console.error(
			"❌ Stripe webhook signature verification failed:",
			err.message,
		);
		return res.status(400).send(`Webhook Error: ${err.message}`);
	}

	if (event.type === "checkout.session.completed") {
		const session = event.data.object;

		const visit_date = session.metadata?.visit_date;
		const nb_participants = parseInt(session.metadata?.nb_participants, 10);
		const userId = parseInt(session.metadata?.userId, 10);
		const amount = parseFloat(session.metadata?.amount);

		console.log("✅ Payment confirmed - Creating reservation:", {
			visit_date,
			nb_participants,
			userId,
		});

		try {
			await Reservations.create({
				visit_date,
				nb_participants,
				userId,
				amount,
			});
		} catch (err) {
			console.error("❌ Failed to save reservation:", err.message);
			return res.status(500).send("Server error while saving reservation");
		}
	}

	res.json({ received: true });
}
