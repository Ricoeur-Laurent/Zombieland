"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTokenContext } from "@/context/TokenProvider";
import { getApiUrl } from "@/utils/getApi";

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function PaiementSection() {
	const { token, loading, user } = useTokenContext();
	const router = useRouter();
	const [paymentLoading, setPaymentLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [reservation, setReservation] = useState<{
		date: string;
		visitors: number;
		calculatedPrice: number;
	} | null>(null);

	useEffect(() => {
		if (!loading && !token) {
			router.push("/connexion?redirect=/paiement");
		}
	}, [token, loading, router]);

	useEffect(() => {
		const stored = localStorage.getItem("zombieland_reservation");
		if (stored) {
			setReservation(JSON.parse(stored));
		} else {
			router.push("/reservations");
		}
	}, [router]);

	const handlePayment = async () => {
		if (!reservation || !token) return;

		setPaymentLoading(true);
		setError(null);

		try {
			const response = await fetch(`${getApiUrl()}/stripe`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
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

			await stripe.redirectToCheckout({ sessionId: data.id }); // back end send back the id
		} catch (err) {
			console.error(err);
			setError("Le paiement a échoué. Veuillez réessayer.");
		} finally {
			setPaymentLoading(false);
		}
	};
	const handleCancel = () => {
		localStorage.removeItem("zombieland_reservation");
		router.push("/");
	};

	if (!reservation) {
		return (
			<p className="text-center text-text">
				Aucune réservation trouvée, vous allez être redirigé vers la page de
				réservation.
			</p>
		);
	}

	return (
		<div className="bg-background p-6 rounded shadow-lg text-text text-center border-2 border-primary">
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
					className="mt-6 mx-auto bg-red-600 text-bg flex items-center justify-center rounded-lg font-bold transition px-3 py-1.5 text-sm sm:px-5 sm:py-2 sm:text-base"
				>
					Annuler
				</button>
			</div>
		</div>
	);
}
