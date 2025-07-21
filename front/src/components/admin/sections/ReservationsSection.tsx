"use client";

import { Edit, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "@/components/modal/Modal";
import { getApiUrl } from "@/utils/getApi";
import ShowMoreButton from "../ui/ShowMoreButton";

// Reservation type returned by the backend
type Reservation = {
	id: number;
	visit_date: string;
	amount: string;
	nb_participants: number;
	userId: number;
	User: {
		id: number;
		firstname: string;
		lastname: string;
		email: string;
	};
};

export default function ReservationsSection() {
	const [reservations, setReservations] = useState<Reservation[]>([]);
	const [query, setQuery] = useState("");
	const [visible, setVisible] = useState(4);
	const [filterDate, setFilterDate] = useState("");
	const step = 4;


	async function handleDeleteReservation() {
		if (!selectedReservation) return;

		setIsDeleting(true);
		try {
			const res = await fetch(
				`${getApiUrl()}/admin/reservations/${selectedReservation.id}`,
				{
					method: "DELETE",
					headers: {},
					credentials: "include",
				},
			);

			if (res.ok) {
				// Remove the deleted reservation from state
				setReservations((prev) =>
					prev.filter((r) => r.id !== selectedReservation.id),
				);
				setShowDeleteModal(false);
				setSelectedReservation(null);
			}
		} catch (err) {
			console.error("Erreur suppression :", err);
		} finally {
			setIsDeleting(false);
		}
	}

	// PATCH
	async function handleEditReservation() {
		if (!selectedReservation || !newDate) return;

		setIsEditing(true);
		try {
			const isoDate = new Date(newDate).toISOString();
			console.log("Date envoyée :", isoDate);
			const res = await fetch(
				`${getApiUrl()}/admin/reservations/${selectedReservation.id}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ visit_date: isoDate }),
					credentials: "include",
				},
			);

			if (res.ok) {
				// Update the reservation in state
				setReservations((prev) =>
					prev.map((r) =>
						r.id === selectedReservation.id ? { ...r, visit_date: isoDate } : r,
					),
				);
				setShowEditModal(false);
				setSelectedReservation(null);
				setNewDate("");
			}
		} catch (err) {
			console.error("Erreur modification :", err);
		} finally {
			setIsEditing(false);
		}
	}
// Fetch all reservations when component mounts
	useEffect(() => {
		async function fetchReservations() {
			try {
				const res = await fetch(`${getApiUrl()}/admin/reservations`, {
					method: "GET",
					headers: {},
					credentials: "include",
				});
				const data = await res.json();
				setReservations(data.reservations || []);
			} catch (err) {
				console.error("Erreur lors du fetch des réservations :", err);
			}
		}
		fetchReservations();
	}, []);

	// Filter by name and date
	const filtered = reservations.filter((r) => {
		const matchesName =
			r.User &&
			`${r.User.firstname} ${r.User.lastname}`
				.toLowerCase()
				.includes(query.toLowerCase());
		const matchesDate = filterDate ? r.visit_date.startsWith(filterDate) : true;
		return matchesName && matchesDate;
	});

	const visibleItems = filtered.slice(0, visible);
	const hasMore = visible < filtered.length;
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [selectedReservation, setSelectedReservation] =
		useState<Reservation | null>(null);
	const [newDate, setNewDate] = useState("");
	const [isDeleting, setIsDeleting] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	// Open edit modal
	function handleEdit(reservation: Reservation) {
		setSelectedReservation(reservation);
		setNewDate(reservation.visit_date.slice(0, 10));
		setShowEditModal(true);
	}

	// Open delete confirmation modal
	function handleDelete(reservationId: number) {
		const reservation = reservations.find((r) => r.id === reservationId);
		if (reservation) {
			setSelectedReservation(reservation);
			setShowDeleteModal(true);
		}
	}

	return (
		<>
			<section className="mb-10 text-text font-body">
				<div className="flex justify-between items-center mb-3">
					<h2 className="text-xl font-subtitle text-primary-light">
						Gestion des réservations
					</h2>
				</div>

				<div className="flex flex-col sm:flex-row gap-3 mb-3">
					{/* Search input */}
					<label className="relative flex-1">
						<input
							type="search"
							placeholder="Rechercher une réservation..."
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							className="w-full pl-10 pr-4 py-2 rounded-md bg-surface text-text border border-muted"
						/>
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted" />
					</label>

					{/* Date filter input with icon */}
					<label className="relative w-full sm:w-auto">
						<input
							type="date"
							value={filterDate}
							onChange={(e) => setFilterDate(e.target.value)}
							className="appearance-none pl-10 pr-4 py-2 rounded-md bg-surface text-text border border-muted w-full"
						/>
					</label>
				</div>
				<ul className="space-y-2">
					{visibleItems.map((r) => (
						<li
							key={r.id}
							className="flex justify-between items-center px-4 py-2 bg-surface border border-muted rounded"
						>
							<span>
								<strong>
									{r.User
										? `${r.User.firstname} ${r.User.lastname}`
										: "Utilisateur inconnu"}
								</strong>{" "}
								– {new Date(r.visit_date).toLocaleDateString()}
							</span>
							<div className="flex gap-2">
								<button
									type="button"
									onClick={() => handleEdit(r)}
									className="text-primary hover:text-primary-dark"
								>
									<Edit className="size-4" />
								</button>
								<button
									type="button"
									onClick={() => handleDelete(r.id)}
									className="text-red-500 hover:text-red-700"
								>
									<Trash2 className="size-4" />
								</button>
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
				isOpen={showDeleteModal}
				onClose={() => {
					setShowDeleteModal(false);
					setSelectedReservation(null);
				}}
				title="Confirmer la suppression"
				confirmText="Supprimer"
				onConfirm={handleDeleteReservation}
				loading={isDeleting}
			>
				<p className="text-text font-body">
					Êtes-vous sûr de vouloir supprimer cette réservation ?
				</p>
			</Modal>

			<Modal
				isOpen={showEditModal}
				onClose={() => {
					setShowEditModal(false);
					setSelectedReservation(null);
					setNewDate("");
				}}
				title="Modifier la réservation"
				confirmText="Confirmer"
				onConfirm={handleEditReservation}
				disableConfirm={!newDate}
				loading={isEditing}
			>
				<input
					type="date"
					value={newDate}
					onChange={(e) => setNewDate(e.target.value)}
					className="w-full mb-4 p-2 border rounded bg-bg text-text"
				/>
			</Modal>
		</>
	);
}
