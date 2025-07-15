"use client";

import { useCallback, useEffect, useState } from "react";
import Modal from "@/components/modal/Modal";
import { useTokenContext } from "@/context/TokenProvider";
import { getApiUrl } from "@/utils/getApi";
import AdminSection from "../ui/AdminSection";
import ItemList from "../ui/ItemList";
import ShowMoreButton from "../ui/ShowMoreButton";

interface Category {
	id: number;
	name: string;
}

export default function CategoriesSection() {
	const { token } = useTokenContext();
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

	const fetchCategories = useCallback(async () => {
		try {
			const res = await fetch(`${getApiUrl()}/admin/categories`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
				credentials: "include",
			});
			const data = await res.json();
			setCategories(data.categories || []);
		} catch (err) {
			console.error("Erreur lors du fetch des catégories :", err);
		}
	}, [token]);

	useEffect(() => {
		if (token) fetchCategories();
	}, [token, fetchCategories]);

	const handleEdit = (category: Category) => {
		setSelectedCategory(category);
		setCategoryName(category.name);
		setShowEditModal(true);
	};

	const handleDelete = (id: number) => {
		const category = categories.find((c) => c.id === id);
		if (category) {
			setSelectedCategory(category);
			setShowDeleteModal(true);
		}
	};

	const handleUpdate = async () => {
		if (!selectedCategory || !categoryName) return;
		setLoading(true);
		try {
			const res = await fetch(
				`${getApiUrl()}/admin/categories/${selectedCategory.id}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ name: categoryName }),
					credentials: "include",
				},
			);
			if (res.ok) {
				fetchCategories();
				setShowEditModal(false);
			}
		} catch (err) {
			console.error("Erreur modification :", err);
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
					headers: {
						Authorization: `Bearer ${token}`,
					},
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

	const handleCreate = async () => {
		if (!categoryName) return;
		setLoading(true);
		try {
			console.log("Nom de la catégorie envoyé :", categoryName);
			const res = await fetch(`${getApiUrl()}/admin/categories`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ name: categoryName }),
				credentials: "include",
			});
			if (res.ok) {
				fetchCategories();
				setShowCreateModal(false);
			}
		} catch (err) {
			console.error("Erreur création :", err);
		} finally {
			setLoading(false);
		}
	};

	const visibleItems = categories.slice(0, visible);
	const hasMore = visible < categories.length;

	return (
		<>
			<AdminSection
				title="Gestion des catégories"
				onCreate={() => {
					setCategoryName("");
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
					className="w-full border border-muted rounded p-2"
				/>
			</Modal>

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
					className="w-full border border-muted rounded p-2"
				/>
			</Modal>
		</>
	);
}
