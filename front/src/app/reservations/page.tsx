import ReservationForm from "@/components/reservations/ReservationForm";

export const metadata = {
	title: "Réservations – Zombieland",
	description:
		"Réservez vos billets pour Zombieland, choisissez votre date et nombre de visiteurs.",
};
export default function ReservationsPage() {
	return (
		<div className="px-4 py-12 min-h-screen flex flex-col items-center justify-start text-text">
			<h2 className="text-center text-3xl sm:text-5xl font-subtitle uppercase text-primary mb-8">
				Réserver votre visite
			</h2>
			<ReservationForm />
		</div>
	);
}
