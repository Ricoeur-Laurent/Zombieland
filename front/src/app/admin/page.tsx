"use client";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTokenContext } from "@/context/TokenProvider";

export default function AdminPage() {
	const { user } = useTokenContext();
	const router = useRouter();

	useEffect(() => {
		if (user === null) {
			router.replace("/connexion");
		} else if (!user.admin) {
			router.replace("/unauthorized");
		}
	}, [user, router]);
	return (
		<div className="max-w-md mx-auto px-4 py-8 text-text font-body">
			<h1 className="text-3xl font-subtitle text-primary text-center mb-8 uppercase">
				Admin Page
			</h1>

			{/* SECTION: Attractions */}
			<AdminSection
				title="Gestion des attractions"
				items={["Attraction 1", "Attraction 2", "Attraction 3"]}
			/>

			{/* SECTION: Catégories */}
			<AdminSection
				title="Gestion des catégories"
				items={["Catégorie 1", "Catégorie 2", "Catégorie 3"]}
			/>

			{/* SECTION: Utilisateurs */}
			<AdminSection
				title="Gestion des utilisateurs"
				items={["User 1", "User 2", "User 3"]}
			/>

			{/* SECTION: Réservations */}
			<div className="mb-10">
				<SectionHeader title="Gestion des réservations" />
				<div className="flex gap-2 mb-3">
					<input
						type="search"
						placeholder="Recherche..."
						className="w-full px-3 py-2 bg-surface border border-muted text-text rounded"
					/>
					<select className="bg-surface border border-muted text-text px-2 py-2 rounded">
						<option>Date</option>
					</select>
				</div>
				<ItemList items={["Résa 1", "Résa 2", "Résa 3"]} />
			</div>
		</div>
	);
}
function AdminSection({ title, items }: { title: string; items: string[] }) {
	return (
		<section className="mb-10">
			<SectionHeader title={title} />
			<ItemList items={items} />
		</section>
	);
}

function SectionHeader({ title }: { title: string }) {
	return (
		<div className="flex justify-between items-center mb-3">
			<h2 className="text-xl font-subtitle text-primary-light">{title}</h2>
			<button type="button" className="text-primary hover:text-primary-dark">
				<Plus />
			</button>
		</div>
	);
}

function ItemList({ items }: { items: string[] }) {
	return (
		<ul className="space-y-2">
			{items.map((item, i) => (
				<li
					key={i}
					className="flex justify-between items-center px-4 py-2 bg-surface border border-muted rounded"
				>
					<span>{item}</span>
					<div className="flex gap-2">
						<Edit className="size-4 text-primary cursor-pointer" />
						<Trash2 className="size-4 text-red-500 cursor-pointer" />
					</div>
				</li>
			))}
		</ul>
	);
}
