import AdminSection from "../ui/AdminSection";

export default function AttractionsSection() {
	const items = ["Zombie Coaster", "Manège de l’Enfer", "Escape des Catacombes"];
	return <AdminSection title="Gestion des attractions" items={items} />;
}
