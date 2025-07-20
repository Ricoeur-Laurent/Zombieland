import Stripe from 'stripe';
import { Reservations } from '../models/index.js';

// Initialize the Stripe instance with your secret key and API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
	apiVersion: '2023-10-16',
});

// Controller function to create a Stripe Checkout session
export const createCheckoutSession = async (req, res) => {
	const { visit_date, nb_participants, calculated_price } = req.body;
	const { id: userId, email } = req.user; // ← get them from the  token JWT

	try {
		// Create a Stripe customer using the user's email
		const customer = await stripe.customers.create({ email });
		console.log('💬 Body reçu :', req.body);

		// Create a Stripe Checkout session for payment
		const session = await stripe.checkout.sessions.create({
			customer: customer.id,
			payment_method_types: ['card'], // Only allow card payments
			mode: 'payment', // One-time payment mode
			line_items: [
				{
					price_data: {
						currency: 'eur',
						product_data: {
							name: `Réservation du ${visit_date}`, // Name shown in Stripe checkout
						},
						unit_amount: calculated_price * 100, // Stripe await cents
					},
					quantity: 1,
				},
			],
			metadata: {
				// Add useful metadata to retrieve later in the webhook
				visit_date,
				nb_participants,
				userId,
				amount: calculated_price,
			},
			// Redirect URLs after payment
			success_url: 'https://zombieland-front-vercel.vercel.app/success',
			cancel_url: 'https://zombieland-front-vercel.vercel.app/cancel',
		});

		res.status(200).json({ id: session.id });
	} catch (error) {
		console.error('❌ Erreur création session Stripe :', error.message);
		res.status(500).json({ error: 'Erreur création session Stripe' });
	}
};

// Controller to handle Stripe webhook events
export async function handleStripeWebhook(req, res) {
	const sig = req.headers['stripe-signature']; // Signature header sent by Stripe
	const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // Your webhook secret

	let event;

	try {
		// Verify the Stripe webhook signature
		event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
	} catch (err) {
		console.error('❌ Stripe webhook signature verification failed:', err.message);
		return res.status(400).send(`Webhook Error: ${err.message}`);
	}

	// Check if the event corresponds to a successful checkout session
	if (event.type === 'checkout.session.completed') {
		const session = event.data.object;

		// Extract metadata from the session to reconstruct the reservation
		const visit_date = session.metadata?.visit_date;
		const nb_participants = parseInt(session.metadata?.nb_participants, 10);
		const userId = parseInt(session.metadata?.userId, 10);
		const amount = parseFloat(session.metadata?.amount);

		console.log('✅ Payment confirmed - Creating reservation:', {
			visit_date,
			nb_participants,
			userId,
		});

		try {
			// Save the reservation in the database
			await Reservations.create({
				visit_date,
				nb_participants,
				userId,
				amount,
			});
		} catch (err) {
			console.error('❌ Failed to save reservation:', err.message);
			return res.status(500).send('Server error while saving reservation');
		}
	}

	// Respond to Stripe to acknowledge receipt of the event
	res.json({ received: true });
}
