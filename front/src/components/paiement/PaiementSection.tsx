"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PaiementValidation from "./PaiementValidation";

export default function PaiementSection() {
	const [showModal, setShowModal] = useState(false);
	const router = useRouter();

	const [reservation, setReservation] = useState<{
		date: string;
		visitors: number;
		calculatedPrice: number;
	} | null>(null);

	useEffect(() => {
		const stored = localStorage.getItem("zombieland_reservation");
		if (stored) {
			setReservation(JSON.parse(stored));
		}
	}, []);

	const handlePayment = () => {
		setShowModal(true);
		setTimeout(() => {
			router.push("/");
		}, 5000);
	};

	if (!reservation) {
		return <p className="text-center">Aucune réservation trouvée.</p>;
	}

	return (
		<div className="bg-background p-6 rounded shadow-lg text-text text-center">
			<h2 className="text-2xl font-bold text-primary mb-4">
				Confirmation de votre réservation
			</h2>
			<p>Date : {reservation.date}</p>
			<p>Nombre de visiteurs : {reservation.visitors}</p>
			<p>Prix total : {reservation.calculatedPrice} €</p>

			<button
				type="button"
				onClick={handlePayment}
				className="mt-6 px-4 py-2 bg-primary text-white rounded hover:bg-primary-light transition"
			>
				Valider le paiement
			</button>

			{showModal && <PaiementValidation />}
		</div>
	);
}
