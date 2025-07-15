import { Edit, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { Attraction } from "@/@types";
import Modal from "@/components/modal/Modal";
import { useTokenContext } from "@/context/TokenProvider";
import { getApiUrl } from "@/utils/getApi";
import ShowMoreButton from "../ui/ShowMoreButton";

export default function AttractionsSection() {
	const { token } = useTokenContext();
	const [attractions, setAttractions] = useState<Attraction[]>([]);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [selectedAttraction, setSelectedAttraction] =
		useState<Attraction | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [visible, setVisible] = useState(4);
	const step = 4;
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");

	const visibleItems = attractions.slice(0, visible);
	const hasMore = visible < attractions.length;

	const slugify = (str: string) =>
		str
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.toLowerCase()
			.trim()
			.replace(/\s+/g, "-")
			.replace(/[^a-z0-9-]/g, "");

	/*fetch attractions */
	const fetchAttractions = useCallback(async () => {
		try {
			const res = await fetch(`${getApiUrl()}/admin/attractions`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
				credentials: "include",
			});
			const data = await res.json();
			if (res.ok) {
				setAttractions(data.allAttractions);
			} else {
				throw new Error("Erreur API");
			}
		} catch (error) {
			console.error(error);
		}
	}, [token]);

	useEffect(() => {
		fetchAttractions();
	}, [fetchAttractions]);

	const handleEdit = async () => {
		if (!selectedAttraction) return;
		try {
			const res = await fetch(
				`${getApiUrl()}/admin/attractions/${selectedAttraction.id}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					credentials: "include",
					body: JSON.stringify({
						name,
						description,
						slug: slugify(name),
						image: `${slugify(name)}.webp`,
					}),
				},
			);

			if (!res.ok) throw new Error("Erreur de soumission");

			await fetchAttractions();
			setShowEditModal(false);
			setSelectedAttraction(null);
			setName("");
			setDescription("");
		} catch (err) {
			console.error(err);
		}
	};

	const handleCreate = async () => {
		try {
			console.log(
				JSON.stringify({
					name,
					description,
					slug: slugify(name),
					image: `${slugify(name)}.webp`,
				}),
			);
			const res = await fetch(`${getApiUrl()}/admin/attractions`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				credentials: "include",
				body: JSON.stringify({
					name,
					description,
					slug: slugify(name),
					image: `${slugify(name)}.webp`,
				}),
			});

			if (!res.ok) throw new Error("Erreur de création");

			await fetchAttractions();
			setShowModal(false);
			setName("");
			setDescription("");
		} catch (err) {
			console.error(err);
		}
	};
	const handleDelete = async () => {
		if (!selectedAttraction) return;
		try {
			const res = await fetch(
				`${getApiUrl()}/admin/attractions/${selectedAttraction.id}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
					},
					credentials: "include",
				},
			);

			if (!res.ok) {
				const err = await res.json();
				console.error("Erreur suppression:", err);
				throw new Error("Suppression échouée");
			}

			await fetchAttractions();
			setShowDeleteModal(false);
			setSelectedAttraction(null);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<>
			<section className="mb-10">
				<div className="flex justify-between items-center mb-3">
					<h2 className="text-xl font-subtitle text-primary-light">
						Gestion des attractions
					</h2>
					<button
						type="button"
						onClick={() => {
							setShowModal(true);
							setName("");
							setDescription("");
							setSelectedAttraction(null);
						}}
						className="text-primary hover:text-primary-dark"
					>
						<Plus />
					</button>
				</div>
				<ul className="space-y-2">
					{visibleItems.map((a, i) => (
						<li
							// biome-ignore lint/suspicious/noArrayIndexKey: usage de l’index ok (liste statique, carrousel embla)
							key={i}
							className="flex justify-between items-center px-4 py-2 bg-surface border border-muted rounded"
						>
							<span>{a.name}</span>
							<div className="flex gap-2">
								<Edit
									onClick={() => {
										setShowEditModal(true);
										setSelectedAttraction(a);
										setName(a.name);
										setDescription(a.description);
									}}
									className="size-4 text-primary cursor-pointer"
								/>
								<Trash2
									className="size-4 text-red-500 cursor-pointer"
									onClick={() => {
										setShowDeleteModal(true);
										setSelectedAttraction(a);
										setName(a.name);
										setDescription(a.description);
									}}
								/>
							</div>
						</li>
					))}
				</ul>
				<ShowMoreButton
					hasMore={hasMore}
					onClick={() => setVisible((v) => v + step)}
				/>
			</section>
			<Modal
				isOpen={showEditModal}
				onClose={() => {
					setShowEditModal(false);
					setSelectedAttraction(null);
				}}
				title="Modifier l'attraction"
				confirmText="Confirmer"
				onConfirm={handleEdit}
			>
				<input
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="w-full mb-2 p-2 border rounded"
				/>
				<textarea
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					className="w-full p-2 border rounded"
				/>
			</Modal>
			<Modal
				isOpen={showModal}
				onClose={() => {
					setShowModal(false);
					setSelectedAttraction(null);
				}}
				title="Créer une attraction"
				confirmText="Créer"
				onConfirm={handleCreate}
			>
				<input
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="w-full mb-2 p-2 border rounded"
					placeholder="Nom"
				/>
				<textarea
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					className="w-full p-2 border rounded"
					placeholder="Description"
				/>
			</Modal>
			<Modal
				isOpen={showDeleteModal}
				onClose={() => {
					setShowDeleteModal(false);
					setSelectedAttraction(null);
				}}
				title="Confirmer la supression"
				confirmText="Confirmer la supression"
				onConfirm={handleDelete}
			>
				<p className="text-text font-body">
					Êtes-vous certain de vouloir supprimer l'attraction ? Toute
					suppression sera définitive.
				</p>
			</Modal>
		</>
	);
}
