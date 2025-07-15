import AdminSection from "../ui/AdminSection";

export default function CategoriesSection() {
	const items = ["Survival", "Escape Game", "Simulation urbaine"];
	return <AdminSection title="Gestion des catégories" items={items} />;
}
