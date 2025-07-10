import ReservationList from "@/components/mes-reservations/ReservationList";

export const metadata = {
	title: "Mes réservations – Zombieland",
	description:
		"Consultez vos réservations et suivez vos billets pour Zombieland facilement depuis votre espace personnel.",
};

export default function MesReservationsPage() {
	return (
		<main className="max-w-md mx-auto p-4">
			<h1 className="text-primary font-subtitle text-3xl text-center mt-4">
				Mes Réservations
			</h1>
			<ReservationList />
		</main>
	);
}
