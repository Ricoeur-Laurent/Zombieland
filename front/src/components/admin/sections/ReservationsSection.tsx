import ItemList from "../ui/ItemList";
import SectionHeader from "../ui/SectionHeader";

export default function ReservationsSection() {
	const items = ["Réservation #001", "Réservation #002", "Réservation #003"];

	return (
		<section className="mb-10">
			<SectionHeader title="Gestion des réservations" />

			<div className="flex gap-2 mb-3">
				<input
					type="search"
					placeholder="Recherche..."
					className="w-full px-3 py-2 bg-surface border border-muted text-text rounded"
				/>
				<select className="bg-surface border border-muted text-text px-2 py-2 rounded">
					<option>Date</option>
					<option>Nom</option>
				</select>
			</div>

			<ItemList items={items} />
		</section>
	);
}
