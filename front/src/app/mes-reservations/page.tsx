import { Suspense } from "react";
import ReservationList from "@/components/mes-reservations/ReservationList";

export const metadata = {
	title: "Mes réservations – Zombieland",
	description:
		"Consultez vos réservations et suivez vos billets pour Zombieland facilement depuis votre espace personnel.",
};

export default function MesReservationsPage() {
	return (
		<div className="px-4 sm:px-6 md:px-8 py-10 max-w-6xl mx-auto">
			<h2 className="text-primary font-subtitle text-3xl text-center ">
				Mes Réservations
			</h2>
			<Suspense fallback={<p className="text-center mt-6">Chargement...</p>}>
				<ReservationList />
			</Suspense>
		</div>
	);
}
