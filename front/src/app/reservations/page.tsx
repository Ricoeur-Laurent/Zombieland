"use client";

import ReservationForm from "@/components/reservations/ReservationForm";
import { useTokenContext } from "@/context/TokenProvider";
import { useRouter } from "next/navigation";

export const metadata = {
	title: "Réservations – Zombieland",
	description: "Réservez vos billets pour Zombieland, choisissez votre date et nombre de visiteurs.",
};


export default function ReservationsPage() {
	const { token } = useTokenContext();
	const router = useRouter();

	return (
		<div className="p-8 min-h-screen flex flex-col items-center justify-center text-text">
			<h2 className="text-center text-3xl sm:text-5xl font-subtitle uppercase text-primary mb-8">
				Réserver votre visite
			</h2>
			<ReservationForm />
		</div>
	);
}
