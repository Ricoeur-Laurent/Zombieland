"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import type { Review } from "@/@types";
import { useTokenContext } from "@/context/TokenProvider";
import { getApiUrl } from "@/utils/getApi";

// Props expected by the modal: attraction ID, close handler, and a submit callback
interface Props {
	attractionId: number;
	onClose: () => void;
	onSubmit: (review: Review) => void;
	initialComment?: string;
	initialRating?: number;
}

export default function ReviewModal({
	attractionId,
	onClose,
	onSubmit,
	initialComment,
	initialRating,
}: Props) {
	// Token from context to check if user is logged in
	const { token } = useTokenContext();
	// State: comment text, star rating, loading status, and error message
	const [comment, setComment] = useState(initialComment || "");
	const [rating, setRating] = useState(initialRating || 5);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const pathname = usePathname();
	const router = useRouter();

	// Handles review submission
	const handleSend = async () => {
		// If not logged in, block the action
		if (!token) {
			// Save review in localStorage and redirect to login if unauthenticated
			localStorage.setItem(
				"pendingReview",
				JSON.stringify({ comment, rating, attractionId }),
			);
			setError("Vous devez être connecté pour laisser un avis.");
			router.push(`/connexion?redirect=${pathname}`);
			return;
		}

		setLoading(true);
		setError(null);
		try {
			const httpResponse = await fetch(
				`${getApiUrl()}/reviews/${attractionId}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`, // Authenticated request
					},
					body: JSON.stringify({ comment, rating }),
				},
			);

			if (!httpResponse.ok) {
				const { error: msg } = await httpResponse.json();
				throw new Error(msg ?? "Échec de l’envoi");
			}

			// Expected response: { message, review }
			const { review } = await httpResponse.json();
			onSubmit(review);
			// biome-ignore lint: explicit any
		} catch (err: any) {
			setError(err.message);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur z-50 flex items-center justify-center">
			<div className="bg-bg rounded-lg p-6 w-full max-w-md">
				<h3 className="text-xl font-bold mb-4">Laisser un avis</h3>

				{error && <p className="text-red-600 mb-2">{error}</p>}

				<textarea
					className="w-full mb-2 p-2 border"
					placeholder="Votre commentaire"
					value={comment}
					onChange={(e) => setComment(e.target.value)}
				/>

				<select
					className="w-full mb-4 p-2 border"
					value={rating}
					onChange={(e) => setRating(Number(e.target.value))}
				>
					{[1, 2, 3, 4, 5].map((n) => (
						<option key={n} value={n} className="bg-bg">
							{n} ⭐
						</option>
					))}
				</select>

				<div className="flex justify-end gap-2">
					<button
						type="button"
						onClick={onClose}
						className="px-3 py-1 rounded bg-muted hover:bg-muted/80"
					>
						Annuler
					</button>
					<button
						type="button"
						disabled={loading}
						onClick={handleSend}
						className="px-3 py-1 rounded bg-primary text-black hover:bg-primary-dark disabled:opacity-50"
					>
						{loading ? "Envoi…" : "Envoyer"}
					</button>
				</div>
			</div>
		</div>
	);
}
