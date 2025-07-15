import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import type { Review } from "@/@types";
import Modal from "@/components/modal/Modal";
import { useTokenContext } from "@/context/TokenProvider";
import { getApiUrl } from "@/utils/getApi";

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
	const { token } = useTokenContext();
	const [comment, setComment] = useState(initialComment || "");
	const [rating, setRating] = useState(initialRating || 5);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const pathname = usePathname();
	const router = useRouter();

	const handleSend = async () => {
		if (!token) {
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
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ comment, rating }),
				},
			);

			if (!httpResponse.ok) {
				const { error: msg } = await httpResponse.json();
				throw new Error(msg ?? "Échec de l’envoi");
			}

			const { review } = await httpResponse.json();
			onSubmit(review);
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

			<textarea
				className="w-full mb-2 p-2 border rounded bg-bg text-text"
				placeholder="Votre commentaire"
				value={comment}
				onChange={(e) => setComment(e.target.value)}
			/>

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
