import ReservationForm from "@/components/reservations/ReservationForm";
import { Suspense } from "react";


export const metadata = {
	title: "Réservations – Zombieland",
	description:
		"Réservez vos billets pour Zombieland, choisissez votre date et nombre de visiteurs.",
};
export default function ReservationsPage() {
	return (
	<div className="px-4 py-6 max-w-6xl mx-auto text-text">
		<h2 className="text-center text-3xl sm:text-5xl font-subtitle uppercase text-primary mb-8">
			Réserver votre visite
		</h2>
			<Suspense  fallback={<p className="text-center mt-6">Chargement...</p>}>
				<ReservationForm />
			</Suspense>
		</div>
	);
}
