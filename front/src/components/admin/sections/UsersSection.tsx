import AdminSection from "../ui/AdminSection";

export default function UsersSection() {
	const items = ["alice@mail.com", "bob@zombie.fr", "charlie@infecte.com"];
	return <AdminSection title="Gestion des utilisateurs" items={items} />;
}
