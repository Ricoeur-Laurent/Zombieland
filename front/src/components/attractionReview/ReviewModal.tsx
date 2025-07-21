import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import type { Review } from "@/@types";
import Modal from "@/components/modal/Modal";
import { useAuthContext } from "@/context/AuthContext";
import { getApiUrl } from "@/utils/getApi";

// Props for the modal component
interface Props {
	attractionId: number; // The ID of the attraction to post the review for
	onClose: () => void; // Callback when the modal closes
	onSubmit: (review: Review) => void; // Callback when a review is successfully submitted
	initialComment?: string; // Optional comment pre-filled (e.g., from localStorage)
	initialRating?: number; // Optional rating pre-filled
}

export default function ReviewModal({
	attractionId,
	onClose,
	onSubmit,
	initialComment,
	initialRating,
}: Props) {
	// Retrieve authenticated user from context
	const { user } = useAuthContext();

	// Local state for form inputs
	const [comment, setComment] = useState(initialComment || "");
	const [rating, setRating] = useState(initialRating || 5);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	// Used to redirect user back to current page after login
	const pathname = usePathname();
	const router = useRouter();
	// Handle form submission
	const handleSend = async () => {
		// If the user is not authenticated, store the review in localStorage and redirect
		if (!user) {
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
					},
					credentials: "include", // Include session cookie (HttpOnly)
					body: JSON.stringify({ comment, rating }),
				},
			);

			if (!httpResponse.ok) {
				const { error: msg } = await httpResponse.json();
				throw new Error(msg ?? "Échec de l’envoi");
			}

			const { review } = await httpResponse.json();
			onSubmit(review);
			// biome-ignore lint/suspicious/noExplicitAny : cast temporary
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal
			isOpen={true}
			onClose={onClose}
			onConfirm={handleSend}
			confirmText="Envoyer"
			loading={loading}
			title="Laisser un avis"
			disableConfirm={comment.trim() === ""}
		>
			{error && <p className="text-red-600 mb-2">{error}</p>}
			{/* Comment input */}
			<textarea
				className="w-full mb-2 p-2 border rounded bg-bg text-text"
				placeholder="Votre commentaire"
				value={comment}
				onChange={(e) => setComment(e.target.value)}
			/>
			{/* Rating selector */}
			<select
				className="w-full mb-4 p-2 border rounded bg-bg text-text"
				value={rating}
				onChange={(e) => setRating(Number(e.target.value))}
			>
				{[1, 2, 3, 4, 5].map((n) => (
					<option key={n} value={n} className="bg-bg">
						{n} ⭐
					</option>
				))}
			</select>
		</Modal>
	);
}
