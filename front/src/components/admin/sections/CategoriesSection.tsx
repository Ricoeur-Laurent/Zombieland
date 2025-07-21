"use client";

import { useCallback, useEffect, useState } from "react";
import Modal from "@/components/modal/Modal";
import { getApiUrl } from "@/utils/getApi";
import AdminSection from "../ui/AdminSection";
import ItemList from "../ui/ItemList";
import ShowMoreButton from "../ui/ShowMoreButton";

interface Category {
	id: number;
	name: string;
}

export default function CategoriesSection() {
	// ========== State Management ==========
	const [categories, setCategories] = useState<Category[]>([]);
	const [visible, setVisible] = useState(4);
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(
		null,
	);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [categoryName, setCategoryName] = useState("");
	const [loading, setLoading] = useState(false);
	const [formError, setFormError] = useState<string | null>(null);
	const [formErrors, setFormErrors] = useState<Record<string, string>>({});
	// ========== Fetch Categories ==========
	const fetchCategories = useCallback(async () => {
		try {
			const res = await fetch(`${getApiUrl()}/admin/categories`, {
				headers: {},
				credentials: "include",
			});
			const data = await res.json();
			setCategories(data.categories || []);
		} catch (err) {
			console.error("Erreur lors du fetch des catégories :", err);
		}
	}, []);
	// we use an use effect here so each time we patch post or delete its changed by an api call
	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);

	const handleEdit = (category: Category) => {
		setSelectedCategory(category);
		// an admin can only update a category name so that's what we 'll send to the api with the function handleUpdate.
		setCategoryName(category.name);
		setFormErrors({});
		setFormError(null);
		setShowEditModal(true);
	};

	const handleDelete = (id: number) => {
		//we find a c(ategory) by its id so we can open the modal to remove this category.
		const category = categories.find((c) => c.id === id);
		if (category) {
			setSelectedCategory(category);
			setShowDeleteModal(true);
		}
	};

	const handleUpdate = async () => {
		if (!selectedCategory || !categoryName) return;
		setLoading(true);
		setFormErrors({});
		setFormError(null);
		try {
			const res = await fetch(
				`${getApiUrl()}/admin/categories/${selectedCategory.id}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ name: categoryName }),
					credentials: "include",
				},
			);

			const data = await res.json();

			if (!res.ok) {
				if (res.status === 400 && Array.isArray(data.error)) {
					const errors = Object.fromEntries(
						// biome-ignore lint/suspicious/noExplicitAny: error object structure is dynamic (from Zod)
						data.error.map((err: any) => [err.path[0], err.message]),
					);
					setFormErrors(errors);
					return;
				}
				setFormError("Erreur inattendue.");
				return;
			}

			fetchCategories();
			setShowEditModal(false);
			setCategoryName("");
		} catch (err) {
			console.error("Erreur modification :", err);
			setFormError("Erreur de connexion au serveur.");
		} finally {
			setLoading(false);
		}
	};

	const handleRemove = async () => {
		if (!selectedCategory) return;
		setLoading(true);
		try {
			const res = await fetch(
				`${getApiUrl()}/admin/categories/${selectedCategory.id}`,
				{
					method: "DELETE",
					headers: {},
					credentials: "include",
				},
			);
			if (res.ok) {
				setCategories((prev) =>
					prev.filter((c) => c.id !== selectedCategory.id),
				);
				setShowDeleteModal(false);
			}
		} catch (err) {
			console.error("Erreur suppression :", err);
		} finally {
			setLoading(false);
		}
	};
	// when we create a category we don't need previous data, that's why there isn't a handle... before we can directly call the function with the modal and the + button is in the SectionHeader of the AdminSection
	const handleCreate = async () => {
		if (!categoryName) return;
		setLoading(true);
		setFormErrors({});
		setFormError(null);
		try {
			const res = await fetch(`${getApiUrl()}/admin/categories`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name: categoryName }),
				credentials: "include",
			});

			const data = await res.json();
			if (!res.ok) {
				if (res.status === 400 && Array.isArray(data.error)) {
					const errors = Object.fromEntries(
						// biome-ignore lint/suspicious/noExplicitAny: error object structure is dynamic (from Zod)
						data.error.map((err: any) => [err.path[0], err.message]),
					);
					setFormErrors(errors);
					return;
				}
				setFormError("Erreur inattendue.");
				return;
			}

			fetchCategories();
			setShowCreateModal(false);
			setCategoryName("");
		} catch (err) {
			console.error("Erreur création :", err);
			setFormError("Erreur de connexion au serveur.");
		} finally {
			setLoading(false);
		}
	};

	const visibleItems = categories.slice(0, visible);
	const hasMore = visible < categories.length;

	return (
		// we use <> and </> at the end so we can write our AdminSection, then the modals that 'll be opened by the + pencil and trash to create, update or delete
		<>
			<AdminSection
				title="Gestion des catégories"
				onCreate={() => {
					setCategoryName("");
					setFormErrors({});
					setFormError(null);
					setShowCreateModal(true);
				}}
			>
				<ItemList
					items={visibleItems}
					onEdit={(i) => handleEdit(visibleItems[i])}
					onDelete={(i) => handleDelete(visibleItems[i].id)}
				/>
				<ShowMoreButton
					hasMore={hasMore}
					onClick={() => setVisible((v) => v + 4)}
				/>
			</AdminSection>

			{/* Modale Edition */}
			{/* here I use the modal component and fill it with the childrens I need */}
			<Modal
				isOpen={showEditModal}
				title="Modifier la catégorie"
				confirmText="Modifier"
				onClose={() => setShowEditModal(false)}
				onConfirm={handleUpdate}
				disableConfirm={!categoryName}
				loading={loading}
			>
				<input
					type="text"
					value={categoryName}
					onChange={(e) => setCategoryName(e.target.value)}
					className={`w-full rounded p-2 border ${formErrors.name ? "border-red-500" : "border-muted"}`}
					aria-invalid={!!formErrors.name}
				/>
				{formErrors.name && (
					<p className="text-sm text-red-500 mt-1">{formErrors.name}</p>
				)}
				{formError && <p className="text-sm text-red-500 mt-2">{formError}</p>}
			</Modal>

			{/* Modale Suppression */}
			<Modal
				isOpen={showDeleteModal}
				title="Supprimer la catégorie"
				confirmText="Supprimer"
				onClose={() => setShowDeleteModal(false)}
				onConfirm={handleRemove}
				loading={loading}
			>
				<p className="text-text font-body">
					Êtes-vous sûr de vouloir supprimer cette catégorie ?
				</p>
			</Modal>

			{/* Modale Création */}
			<Modal
				isOpen={showCreateModal}
				title="Créer une catégorie"
				confirmText="Créer"
				onClose={() => setShowCreateModal(false)}
				onConfirm={handleCreate}
				disableConfirm={!categoryName}
				loading={loading}
			>
				<input
					type="text"
					value={categoryName}
					onChange={(e) => setCategoryName(e.target.value)}
					className={`w-full rounded p-2 border ${formErrors.name ? "border-red-500" : "border-muted"}`}
					aria-invalid={!!formErrors.name}
				/>
				{formErrors.name && (
					<p className="text-sm text-red-500 mt-1">{formErrors.name}</p>
				)}
				{formError && <p className="text-sm text-red-500 mt-2">{formError}</p>}
			</Modal>
		</>
	);
}
