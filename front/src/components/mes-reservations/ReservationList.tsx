"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Modal from "@/components/modal/Modal";
import { useAuthContext } from "@/context/AuthContext";
import { getApiUrl } from "@/utils/getApi";

interface Reservation {
	id: string;
	visit_date: string;
	amount: number;
	nb_participants: number;
	userId: string;
}

export default function ReservationList() {
	const { user, loading } = useAuthContext();
	const [reservations, setReservations] = useState<Reservation[]>([]);
	const [fetchingReservations, setFetchingReservations] = useState(true);
	const [redirecting, setRedirecting] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();

	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [selectedReservation, setSelectedReservation] =
		useState<Reservation | null>(null);
	const [newDate, setNewDate] = useState("");
	const [isDeleting, setIsDeleting] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	const handleDeleteReservation = async () => {
		if (!selectedReservation) return;

		const today = new Date();
		const visitDate = new Date(selectedReservation.visit_date);
		const diffTime = visitDate.getTime() - today.getTime();
		const diffDays = diffTime / (1000 * 60 * 60 * 24);

		// Prevent deletion if the reservation is less than 10 days away
		if (diffDays <= 10) {
			console.warn("Deletion not allowed within 10 days of the visit.");
			return;
		}

		if (diffDays <= 10) {
			console.warn("Suppression interdite à moins de 10 jours.");
			return;
		}

		setIsDeleting(true);
		try {
			const response = await fetch(
				`${getApiUrl()}/myReservations/${selectedReservation.id}`,
				{
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				},
			);

			if (response.ok) {
				setReservations((prev) =>
					prev.filter((r) => r.id !== selectedReservation.id),
				);
				setShowDeleteModal(false);
				setSelectedReservation(null);
			} else {
				console.error("Erreur lors de la suppression.");
			}
		} catch (error) {
			console.error("Erreur lors de la suppression :", error);
		} finally {
			setIsDeleting(false);
		}
	};

	const handleEditReservation = async () => {
		if (!selectedReservation || !newDate) return;

		const today = new Date();
		const visitDate = new Date(newDate);
		const diffTime = visitDate.getTime() - today.getTime();
		const diffDays = diffTime / (1000 * 60 * 60 * 24);

		// Prevent editing if the reservation is less than 10 days away
		if (diffDays <= 10) {
			console.warn("Modification interdite à moins de 10 jours.");
			return;
		}

		setIsEditing(true);
		try {
			const isoDate = visitDate.toISOString(); // déjà calculé
			const response = await fetch(
				`${getApiUrl()}/myReservations/${selectedReservation.id}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ visit_date: isoDate }),
				},
			);

			if (response.ok) {
				setReservations((prev) =>
					prev.map((r) =>
						r.id === selectedReservation.id ? { ...r, visit_date: isoDate } : r,
					),
				);
				setShowEditModal(false);
				setSelectedReservation(null);
				setNewDate("");
			} else {
				console.error("Erreur lors de la modification.");
			}
		} catch (error) {
			console.error("Erreur lors de la modification :", error);
		} finally {
			setIsEditing(false);
		}
	};

	// If the user is not authenticated, redirect to login after 3 seconds
	useEffect(() => {
		if (loading) return; // ⛔️ do not take effect if loading

		if (!user || !user.id) {
			setRedirecting(true);
			const timeout = setTimeout(() => {
				const redirectPath =
					searchParams.get("redirect") || "/mes-reservations";
				router.push(`/connexion?redirect=${redirectPath}`);
			}, 3000);
			return () => clearTimeout(timeout);
		}
	}, [loading, user, router, searchParams]);

	useEffect(() => {
		const fetchReservations = async () => {
			try {
				const response = await fetch(`${getApiUrl()}/myReservations/userId`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
				});
				if (!response.ok) {
					console.error("Erreur lors de la récupération des réservations");
					return;
				}
				const data = await response.json();
				setReservations(data.userReservations || []);
			} catch (error) {
				console.error("Erreur lors de la récupération des réservations", error);
			} finally {
				setFetchingReservations(false);
			}
		};
		if (user?.id) {
			fetchReservations();
		} else {
			setFetchingReservations(false);
		}
	}, [user]);

	if (redirecting) {
		return (
			<p className="text-center text-primary mt-6">
				Vous devez être connecté pour avoir accès à vos réservations,
				<br />
				vous allez être redirigé vers la connexion...
			</p>
		);
	}

	if (loading || fetchingReservations) {
		return (
			<p className="text-center text-primary mt-6">
				Chargement des réservations...
			</p>
		);
	}

	if (reservations.length === 0) {
		return (
			<p className="text-center text-muted mt-6">
				Vous n'avez pas encore de réservations.
			</p>
		);
	}
	// User can only select a new date at least 10 days from today
	function getMinReservationDate(): string {
		const today = new Date();
		today.setDate(today.getDate() + 10);
		return today.toISOString().split("T")[0];
	}

	return (
		<>
			<div className="flex flex-col gap-4 mt-6">
				{reservations.map((reservation) => {
					const today = new Date();
					const visitDate = new Date(reservation.visit_date);
					const diffTime = visitDate.getTime() - today.getTime();
					const diffDays = diffTime / (1000 * 60 * 60 * 24);

					return (
						<div
							key={reservation.id}
							className="bg-surface/70 rounded-lg border-l-4 border-primary p-4 shadow-md flex flex-col gap-2"
						>
							<h2 className="text-primary-light font-subtitle text-xl">
								Réservation du {visitDate.toLocaleDateString()}
							</h2>
							<p className="text-text font-body">
								Nombre de participants : {reservation.nb_participants}
							</p>
							<p className="text-text font-body">
								Montant payé : {Number(reservation.amount).toFixed(2)} €
							</p>

							{diffDays > 10 && (
								<div className="flex gap-2 mt-2">
									<button
										type="button"
										className="bg-primary text-bg rounded px-3 py-1.5 font-bold  w-1/2"
										onClick={() => {
											setSelectedReservation(reservation);
											setNewDate(reservation.visit_date.slice(0, 10));
											setShowEditModal(true);
										}}
									>
										Modifier
									</button>
									<button
										type="button"
										className="bg-red-600 text-bg rounded px-4 py-2 font-bold  w-1/2"
										onClick={() => {
											setSelectedReservation(reservation);
											setShowDeleteModal(true);
										}}
									>
										Annuler
									</button>
								</div>
							)}
						</div>
					);
				})}
			</div>

			<Modal
				isOpen={showDeleteModal}
				onClose={() => {
					setShowDeleteModal(false);
					setSelectedReservation(null);
				}}
				title="Confirmer l'annulation"
				confirmText="Confirmer l'annulation"
				onConfirm={handleDeleteReservation}
				loading={isDeleting}
			>
				<p className="text-text font-body">
					Êtes-vous certain de vouloir annuler ? Un remboursement vous sera
					effectué.
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
					min={getMinReservationDate()}
					className="w-full mb-4 p-2 border rounded bg-bg text-text"
				/>
			</Modal>
		</>
	);
}
