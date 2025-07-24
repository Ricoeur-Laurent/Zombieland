import { Suspense } from "react";
import ReservationList from "@/components/mes-reservations/ReservationList";

export const metadata = {
	title: "Mes réservations – Zombieland",
	description:
		"Consultez vos réservations et suivez vos billets pour Zombieland facilement depuis votre espace personnel.",
};

export default function MesReservationsPage() {
	return (
		<div className="max-w-md mx-auto p-4 px-4 py-6 ">
			<h2 className="text-primary font-subtitle text-3xl text-center mt-4">
				Mes Réservations
			</h2>
			<Suspense fallback={<p className="text-center mt-6">Chargement...</p>}>
				<ReservationList />
			</Suspense>
		</div>
	);
}
