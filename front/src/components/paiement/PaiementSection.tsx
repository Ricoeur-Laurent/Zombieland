"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTokenContext } from "@/context/TokenProvider";
import PaiementValidation from "./PaiementValidation";

export default function PaiementSection() {
	const { token } = useTokenContext();
	const router = useRouter();
	const [showModal, setShowModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [reservation, setReservation] = useState<{
		date: string;
		visitors: number;
		calculatedPrice: number;
	} | null>(null);

	// Redirect user to /connexion if not authenticated
	useEffect(() => {
		if (!token) {
			router.push("/connexion?redirect=/paiement");
		}
	}, [token, router]);

	useEffect(() => {
		const stored = localStorage.getItem("zombieland_reservation");
		// Check if reservation data exists in localStorage
		if (stored) {
			setReservation(JSON.parse(stored));
		} else {
			router.push("/reservations");
		}
	}, [router]);

	const handlePayment = async () => {
		if (!reservation || !token) return;

		setLoading(true);
		setError(null);

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reservations`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include", // send cookies with request
				body: JSON.stringify({
					visit_date: reservation.date,
					nb_participants: reservation.visitors,
					amount: reservation.calculatedPrice,
			}),
			
			});

			if (!response.ok) {
				throw new Error(`Erreur API: ${response.status}`);
			}

			setShowModal(true);
			// Clear localStorage to avoid duplicate reservations if user revisits this page
			localStorage.removeItem("zombieland_reservation");

			// Show success modal and redirect after 5 seconds
			setTimeout(() => {
				router.push("/mes-reservations");
			}, 5000);
		} catch (err) {
			console.error(err);
			setError("Le paiement a échoué. Veuillez réessayer.");
		} finally {
			setLoading(false);
		}
	};

	if (!reservation) {
		return <p className="text-center text-text">Aucune réservation trouvée.</p>;
	}

	return (
		<div className="bg-background p-6 rounded shadow-lg text-text text-center border border-primary">
			<h2 className="text-2xl font-bold text-primary-light mb-4">
				Confirmation de votre réservation
			</h2>
			<p>Date : {reservation.date}</p>
			<p>Nombre de visiteurs : {reservation.visitors}</p>
			<p>Prix total : {reservation.calculatedPrice} €</p>

			{error && <p className="text-red-500 mt-2">{error}</p>}

			<button
				type="button"
				onClick={handlePayment}
				disabled={loading}
				className={`mt-6 mx-auto flex items-center justify-center rounded-lg font-bold transition
    ${
			loading
				? "bg-primary/50 cursor-not-allowed text-bg"
				: "bg-primary text-bg hover:bg-primary-dark"
		}
    px-3 py-1.5 text-sm sm:px-5 sm:py-2 sm:text-base`}
			>
				{loading ? "Paiement en cours..." : "Valider le paiement"}
			</button>

			{showModal && <PaiementValidation />}
		</div>
	);
}
