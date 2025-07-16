"use client";

import { useCallback, useEffect, useState } from "react";
import Modal from "@/components/modal/Modal";
import { useTokenContext } from "@/context/TokenProvider";
import { getApiUrl } from "@/utils/getApi";
import AdminSection from "../ui/AdminSection";
import ItemList from "../ui/ItemList";
import ShowMoreButton from "../ui/ShowMoreButton";

interface Member {
	id: number;
	firstname: string;
	lastname: string;
	email: string;
	phone: string;
	admin: boolean;
}

export default function MembersSection() {
	const { token } = useTokenContext();
	const [members, setMembers] = useState<Member[]>([]);
	const [visible, setVisible] = useState(4);
	const [selectedMember, setSelectedMember] = useState<Member | null>(null);
	const [showEditModal, setShowEditModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [isCreating, setIsCreating] = useState(false);

	const [form, setForm] = useState<{
		firstname: string;
		lastname: string;
		email: string;
		phone: string;
		admin: boolean;
		password?: string;
	}>({
		firstname: "",
		lastname: "",
		email: "",
		phone: "",
		admin: false,
		password: "",
	});

	const fetchMembers = useCallback(async () => {
		try {
			const res = await fetch(`${getApiUrl()}/admin/users`, {
				headers: { Authorization: `Bearer ${token}` },
				credentials: "include",
			});
			const data = await res.json();
			setMembers(data);
		} catch (err) {
			console.error("Erreur fetch membres :", err);
		}
	}, [token]);

	useEffect(() => {
		if (token) fetchMembers();
	}, [token, fetchMembers]);

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
						Authorization: `Bearer ${token}`,
					},
					credentials: "include",
					body: JSON.stringify(payload),
				},
			);

			if (res.ok) {
				fetchMembers();
				setShowEditModal(false);
			}
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
					headers: { Authorization: `Bearer ${token}` },
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
					Authorization: `Bearer ${token}`,
				},
				credentials: "include",
				body: JSON.stringify(payload),
			});
			if (res.ok) {
				fetchMembers();
				setShowCreateModal(false);
			}
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
				<MemberForm form={form} setForm={setForm} isCreating={isCreating} />
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
				<MemberForm form={form} setForm={setForm} isCreating={isCreating} />
			</Modal>
		</>
	);
}

function MemberForm({
	form,
	setForm,
	isCreating,
}: {
	form: any;
	setForm: any;
	isCreating: boolean;
}) {
	function formatPhone(value: string) {
		const digits = value.replace(/\D/g, "").slice(0, 10);
		return digits.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
	}
	return (
		<div className="space-y-3">
			<input
				type="text"
				placeholder="Prénom"
				className="w-full border border-muted rounded p-2"
				value={form.firstname}
				onChange={(e) =>
					setForm((f: any) => ({ ...f, firstname: e.target.value }))
				}
			/>
			<input
				type="text"
				placeholder="Nom"
				className="w-full border border-muted rounded p-2"
				value={form.lastname}
				onChange={(e) =>
					setForm((f: any) => ({ ...f, lastname: e.target.value }))
				}
			/>
			<input
				type="email"
				placeholder="Email"
				className="w-full border border-muted rounded p-2"
				value={form.email}
				onChange={(e) => setForm((f: any) => ({ ...f, email: e.target.value }))}
			/>
			<input
				type="tel"
				placeholder="Téléphone"
				className="w-full border border-muted rounded p-2"
				value={form.phone}
				onChange={(e) =>
					setForm((f: any) => ({
						...f,
						phone: formatPhone(e.target.value),
					}))
				}
			/>
			{isCreating && (
				<input
					type="password"
					placeholder="Mot de passe (optionnel)"
					className="w-full border border-muted rounded p-2"
					value={form.password || ""}
					onChange={(e) =>
						setForm((f: any) => ({ ...f, password: e.target.value }))
					}
				/>
			)}
			<label className="flex items-center gap-2">
				<input
					type="checkbox"
					checked={form.admin}
					onChange={(e) =>
						setForm((f: any) => ({ ...f, admin: e.target.checked }))
					}
				/>
				<span>Admin</span>
			</label>
		</div>
	);
}
