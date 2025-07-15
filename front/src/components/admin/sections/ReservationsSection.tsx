"use client";

import { Edit, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTokenContext } from "@/context/TokenProvider";
import { getApiUrl } from "@/utils/getApi";
import ShowMoreButton from "../ui/ShowMoreButton";

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
function handleEdit(reservation: Reservation): void {
	console.log("Modifier la réservation :", reservation);
	// TODO: ouvrir un formulaire avec les détails à éditer
}

function handleDelete(reservationId: number): void {
	console.log("Supprimer la réservation ID :", reservationId);
	// TODO: afficher une modale de confirmation, puis appeler DELETE API
}

export default function ReservationsSection() {
	const { token } = useTokenContext();
	const [reservations, setReservations] = useState<Reservation[]>([]);
	const [query, setQuery] = useState("");
	const [visible, setVisible] = useState(4);
	const step = 4;

	useEffect(() => {
		async function fetchReservations() {
			try {
				const res = await fetch(`${getApiUrl()}/admin/reservations`, {
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},
					credentials: "include",
				});
				const data = await res.json();
				console.log("Réservations reçues :", data.reservations);
				setReservations(data.reservations || []);
			} catch (err) {
				console.error("Erreur lors du fetch des réservations :", err);
			}
		}
		if (token) fetchReservations();
	}, [token]);

	const filtered = reservations.filter(
		(r) =>
			r.User &&
			`${r.User.firstname} ${r.User.lastname}`
				.toLowerCase()
				.includes(query.toLowerCase()),
	);

	const visibleItems = filtered.slice(0, visible);
	const hasMore = visible < filtered.length;

	return (
		<section className="mb-10 text-text font-body">
			<div className="flex justify-between items-center mb-3">
				<h2 className="text-xl font-subtitle text-primary-light">
					Gestion des réservations
				</h2>
			</div>

			<div className="mb-3">
				<label className="relative block">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted size-5" />
					<input
						type="search"
						placeholder="Rechercher une réservation..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="w-full pl-10 pr-4 py-2 rounded-md bg-surface text-text border border-muted"
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

						{/* Actions */}
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
	);
}
