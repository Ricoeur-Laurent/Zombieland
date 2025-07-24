"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { getApiUrl } from "@/utils/getApi";

// Initialize Stripe with the public key from the environment
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (!stripeKey) {
	throw new Error("Missing Stripe public key");
}

// Load Stripe later when needed
const stripePromise = loadStripe(stripeKey);

export default function PaiementSection() {
	const { loading, user } = useAuthContext();
	const router = useRouter();
	const [paymentLoading, setPaymentLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [reservation, setReservation] = useState<{
		date: string;
		visitors: number;
		calculatedPrice: number;
	} | null>(null);

	// Redirect to login if user is not authenticated
	useEffect(() => {
		if (!loading && !user) {
			router.push("/connexion?redirect=/paiement");
		}
	}, [user, loading, router]);

	// Load reservation data from localStorage
	useEffect(() => {
		const stored = localStorage.getItem("zombieland_reservation");
		if (stored) {
			setReservation(JSON.parse(stored));
		} else {
			router.push("/reservations");
		}
	}, [router]);

	// Create Stripe Checkout session and redirect to Stripe
	const handlePayment = async () => {
		if (!reservation || !user) return;

		setPaymentLoading(true);
		setError(null);

		try {
			const response = await fetch(`${getApiUrl()}/stripe`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					visit_date: reservation.date,
					nb_participants: reservation.visitors,
					calculated_price: reservation.calculatedPrice,
					userId: user?.id,
				}),
			});

			if (!response.ok) {
				throw new Error("Erreur lors de la création de la session Stripe.");
			}

			const data = await response.json();
			const stripe = await stripePromise;

			if (!stripe) {
				throw new Error("Stripe n’a pas pu être initialisé.");
			}

			// Redirect user to Stripe checkout page
			await stripe.redirectToCheckout({ sessionId: data.id }); // back end send back the id
		} catch (err) {
			console.error(err);
			setError("Le paiement a échoué. Veuillez réessayer.");
		} finally {
			setPaymentLoading(false);
		}
	};
	// Cancel reservation (clears local storage and redirects home)
	const handleCancel = () => {
		localStorage.removeItem("zombieland_reservation");
		router.push("/");
	};

	// No reservation found
	if (!reservation) {
		return (
			<p className="text-center text-text">
				Aucune réservation trouvée, vous allez être redirigé vers la page de
				réservation.
			</p>
		);
	}

	return (
		<div className="bg-surface/70  p-6 rounded-lg shadow-lg text-text text-center border-l-4 border-primary">
			<h2 className="text-2xl font-bold text-primary-light mb-4">
				Confirmation de votre réservation
			</h2>

			<div className="mt-3 text-lg mb-4">
				<p>Date : {reservation.date}</p>
				<p>Nombre de visiteurs : {reservation.visitors}</p>
				<p>Prix total : {reservation.calculatedPrice} €</p>
			</div>
			<p className="border-2 border-red-600 p-6">
				Ce site est un projet scolaire. Aucun produit ou service réel n’est
				proposé à la vente. <br />
				Vous pouvez tester le processus de paiement en utilisant une carte de
				test fournie par Stripe : <br />
				Numéro : 4242 4242 4242 4242 <br />
				Expiration : n’importe quelle date future <br />
				CVC : n’importe quel code à 3 chiffres
				<br /> Nom / Adresse : libre
				<br /> ⚠️ Aucune somme ne sera réellement débitée.
			</p>

			{error && <p className="text-red-500 mt-2">{error}</p>}

			<div className="flex">
				<button
					type="button"
					onClick={handlePayment}
					disabled={paymentLoading}
					className={`mt-6 mx-auto flex items-center justify-center rounded-lg font-bold transition
						${
							paymentLoading
								? "bg-primary/50 cursor-not-allowed text-bg"
								: "bg-primary text-bg hover:bg-primary-dark"
						}
						px-3 py-1.5 text-sm sm:px-5 sm:py-2 sm:text-base`}
				>
					{paymentLoading ? "Paiement en cours..." : "Valider le paiement"}
				</button>
				<button
					type="button"
					onClick={handleCancel}
					className="mt-6 mx-auto bg-red-600 hover:bg-red-700 text-bg flex items-center justify-center rounded-lg font-bold transition px-3 py-1.5 text-sm sm:px-5 sm:py-2 sm:text-base"
				>
					Annuler
				</button>
			</div>
		</div>
	);
}
