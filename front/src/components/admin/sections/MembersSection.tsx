"use client";

import { useCallback, useEffect, useState } from "react";
import Modal from "@/components/modal/Modal";
import { getApiUrl } from "@/utils/getApi";
import AdminSection from "../ui/AdminSection";
import ItemList from "../ui/ItemList";
import ShowMoreButton from "../ui/ShowMoreButton";

// Member type returned by the backend
interface Member {
	id: number;
	firstname: string;
	lastname: string;
	email: string;
	phone: string;
	admin: boolean;
}
// Data structure used in forms
type MemberFormData = {
	firstname: string;
	lastname: string;
	email: string;
	phone: string;
	admin: boolean;
	password?: string;
};

// Form validation errors
type MemberFormErrors = Partial<Record<keyof MemberFormData, string>>;

export default function MembersSection() {
	const [members, setMembers] = useState<Member[]>([]);
	const [visible, setVisible] = useState(4);
	const [selectedMember, setSelectedMember] = useState<Member | null>(null);

	// Modal visibility
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showCreateModal, setShowCreateModal] = useState(false);

	const [loading, setLoading] = useState(false);
	const [isCreating, setIsCreating] = useState(false);

	// Form state
	const [form, setForm] = useState<MemberFormData>({
		firstname: "",
		lastname: "",
		email: "",
		phone: "",
		admin: false,
		password: "",
	});
	const [formErrors, setFormErrors] = useState<MemberFormErrors>({});

	// Fetch members from the API
	const fetchMembers = useCallback(async () => {
		try {
			const res = await fetch(`${getApiUrl()}/admin/users`, {
				headers: {},
				credentials: "include",
			});
			const data = await res.json();
			setMembers(data);
		} catch (err) {
			console.error("Erreur fetch membres :", err);
		}
	}, []);

	useEffect(() => {
		fetchMembers();
	}, [fetchMembers]);

	const handleEdit = (member: Member) => {
		console.log("Membre édité :", member);
		setSelectedMember(member);
		setForm({
			firstname: member.firstname,
			lastname: member.lastname,
			email: member.email,
			phone: member.phone,
			admin: !!member.admin, // ✅ to force a boolean
		});
		setIsCreating(false);
		setShowEditModal(true);
	};

	const handleDelete = (id: number) => {
		const member = members.find((m) => m.id === id);
		if (member) {
			setSelectedMember(member);
			setShowDeleteModal(true);
		}
	};

	const handleUpdate = async () => {
		if (!selectedMember) return;
		setLoading(true);
		setFormErrors({});
		try {
			const rawPhone = form.phone.replace(/\D/g, "");
			// ✅ Déstructuring before the fetch
			const { firstname, lastname, email, admin } = form;
			const payload = { firstname, lastname, email, phone: rawPhone, admin };
			console.log("Payload envoyé :", payload);

			const res = await fetch(
				`${getApiUrl()}/admin/users/${selectedMember.id}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify(payload),
				},
			);

			const data = await res.json();

			// Handle validation errors
			if (!res.ok) {
				if (res.status === 400 && Array.isArray(data.errors)) {
					const errors = Object.fromEntries(
						data.errors.map((err: { path: string[]; message: string }) => [
							err.path[0],
							err.message,
						]),
					);
					setFormErrors(errors);
					return;
				}
				console.error("Erreur modification membre :", data);
				return;
			}

			fetchMembers();
			setShowEditModal(false);
		} catch (err) {
			console.error("Erreur modification membre :", err);
		} finally {
			setLoading(false);
		}
	};
	const handleRemove = async () => {
		if (!selectedMember) return;
		setLoading(true);
		try {
			const res = await fetch(
				`${getApiUrl()}/admin/users/${selectedMember.id}`,
				{
					method: "DELETE",
					headers: {},
					credentials: "include",
				},
			);
			if (res.ok) {
				setMembers((prev) => prev.filter((m) => m.id !== selectedMember.id));
				setShowDeleteModal(false);
			}
		} catch (err) {
			console.error("Erreur suppression membre :", err);
		} finally {
			setLoading(false);
		}
	};

	const handleCreate = async () => {
		setLoading(true);
		setFormErrors({}); // reset
		try {
			const rawPhone = form.phone.replace(/\D/g, "");
			const payload = {
				...form,
				phone: rawPhone,
				password: form.password?.trim() || "changeme",
			};

			const res = await fetch(`${getApiUrl()}/admin/users`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(payload),
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
				console.error("Erreur création membre :", data);
				return;
			}

			fetchMembers();
			setShowCreateModal(false);
		} catch (err) {
			console.error("Erreur création membre :", err);
		} finally {
			setLoading(false);
		}
	};

	const visibleItems = members.slice(0, visible);
	const hasMore = visible < members.length;

	return (
		<>
			<AdminSection
				title="Gestion des membres"
				onCreate={() => {
					setForm({
						firstname: "",
						lastname: "",
						email: "",
						phone: "",
						admin: false,
					});
					setIsCreating(true);
					setSelectedMember(null);
					setShowCreateModal(true);
				}}
			>
				<ItemList
					items={visibleItems.map((m) => ({
						id: m.id,
						name: `${m.firstname} ${m.lastname}`,
					}))}
					onEdit={(i) => handleEdit(visibleItems[i])}
					onDelete={(i) => handleDelete(visibleItems[i].id)}
				/>

				<ShowMoreButton
					hasMore={hasMore}
					onClick={() => setVisible((v) => v + 4)}
				/>
			</AdminSection>

			{/* Modale Edition */}
			<Modal
				isOpen={showEditModal}
				title="Modifier un membre"
				confirmText="Modifier"
				onClose={() => setShowEditModal(false)}
				onConfirm={handleUpdate}
				disableConfirm={!form.firstname || !form.lastname || !form.email}
				loading={loading}
			>
				<MemberForm
					form={form}
					setForm={setForm}
					isCreating={isCreating}
					formErrors={formErrors}
				/>
			</Modal>

			{/* Modale Suppression */}
			<Modal
				isOpen={showDeleteModal}
				title="Supprimer un membre"
				confirmText="Supprimer"
				onClose={() => setShowDeleteModal(false)}
				onConfirm={handleRemove}
				loading={loading}
			>
				<p className="text-text font-body">
					Voulez-vous vraiment supprimer ce membre ?
				</p>
			</Modal>

			{/* Modale Création */}
			<Modal
				isOpen={showCreateModal}
				title="Créer un membre"
				confirmText="Créer"
				onClose={() => setShowCreateModal(false)}
				onConfirm={handleCreate}
				disableConfirm={!form.firstname || !form.lastname || !form.email}
				loading={loading}
			>
				<MemberForm
					form={form}
					setForm={setForm}
					isCreating={isCreating}
					formErrors={formErrors}
				/>
			</Modal>
		</>
	);
}

// Form used in both create and edit modals
function MemberForm({
	form,
	setForm,
	isCreating,
	formErrors,
}: {
	form: MemberFormData;
	setForm: React.Dispatch<React.SetStateAction<MemberFormData>>;
	isCreating: boolean;
	formErrors: MemberFormErrors;
}) {
	function formatPhone(value: string) {
		const digits = value.replace(/\D/g, "").slice(0, 10);
		return digits.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
	}

	return (
		<div className="space-y-3">
			{/* First name */}
			<input
				type="text"
				placeholder="Prénom"
				className={`w-full rounded p-2 border ${formErrors.firstname ? "border-red-500" : "border-muted"}`}
				aria-invalid={!!formErrors.firstname}
				value={form.firstname}
				onChange={(e) => setForm((f) => ({ ...f, firstname: e.target.value }))}
			/>
			{formErrors.firstname && (
				<p className="text-sm text-red-500">{formErrors.firstname}</p>
			)}

			{/* Last name */}
			<input
				type="text"
				placeholder="Nom"
				className={`w-full rounded p-2 border ${formErrors.lastname ? "border-red-500" : "border-muted"}`}
				aria-invalid={!!formErrors.lastname}
				value={form.lastname}
				onChange={(e) => setForm((f) => ({ ...f, lastname: e.target.value }))}
			/>
			{formErrors.lastname && (
				<p className="text-sm text-red-500 mt-1">{formErrors.lastname}</p>
			)}

			{/* Email */}
			<input
				type="email"
				placeholder="Email"
				className={`w-full rounded p-2 border ${formErrors.email ? "border-red-500" : "border-muted"}`}
				aria-invalid={!!formErrors.email}
				value={form.email}
				onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
			/>
			{formErrors.email && (
				<p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
			)}

			{/* Phone */}
			<input
				type="tel"
				placeholder="Téléphone"
				className={`w-full rounded p-2 border ${formErrors.phone ? "border-red-500" : "border-muted"}`}
				aria-invalid={!!formErrors.phone}
				value={form.phone}
				onChange={(e) =>
					setForm((f) => ({
						...f,
						phone: formatPhone(e.target.value),
					}))
				}
			/>
			{formErrors.phone && (
				<p className="text-sm text-red-500 mt-1">{formErrors.phone}</p>
			)}

			{/* password if create */}
			{isCreating && (
				<div>
					<input
						type="password"
						placeholder="Mot de passe (optionnel)"
						className={`w-full rounded p-2 border ${formErrors.password ? "border-red-500" : "border-muted"}`}
						aria-invalid={!!formErrors.password}
						value={form.password || ""}
						onChange={(e) =>
							setForm((f) => ({ ...f, password: e.target.value }))
						}
					/>
					{formErrors.password && (
						<p className="text-sm text-red-500 mt-1">{formErrors.password}</p>
					)}
				</div>
			)}
			{/* Checkbox admin */}
			<label htmlFor="admin" className="flex items-center gap-2">
				<input
					id="admin"
					type="checkbox"
					checked={form.admin}
					onChange={(e) => setForm((f) => ({ ...f, admin: e.target.checked }))}
				/>
				<span>Admin</span>
			</label>
		</div>
	);
}
