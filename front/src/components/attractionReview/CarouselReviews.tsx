"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import type { Review } from "@/@types";
import { getApiUrl } from "@/utils/getApi";
import ReviewCard from "./ReviewCard";
import ReviewModal from "./ReviewModal";

type Props = {
	attractionId: number; // ID of the attraction to fetch reviews for
};

export default function CarouselReviews({ attractionId }: Props) {
	// Embla carousel hook with loop mode enabled
	const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
	// List of fetched reviews
	const [reviews, setReviews] = useState<Review[]>([]);

	// Index of the currently selected review in the carousel
	const [selectedIndex, setSelectedIndex] = useState(0);
	// Modal visibility state
	const [showModal, setShowModal] = useState(false);
	// Initial values when restoring a review from localStorage (draft recovery)
	const [initialComment, setInitialComment] = useState("");
	const [initialRating, setInitialRating] = useState(5);

	// Fetch reviews from the API for the current attraction
	useEffect(() => {
		async function fetchReviews() {
			try {
				const res = await fetch(`${getApiUrl()}/reviews/${attractionId}`);
				const data = await res.json();

				setReviews(data.reviews);
			} catch (err) {
				console.error("Erreur fetch reviews :", err);
			}
		}
		fetchReviews();
	}, [attractionId]);

	// On mount, restore pending review from localStorage if it matches the current attraction.
	useEffect(() => {
		const stored = localStorage.getItem("pendingReview");
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				if (parsed?.attractionId === attractionId) {
					setInitialComment(parsed.comment || "");
					setInitialRating(parsed.rating || 5);
					setShowModal(true); // Automatically reopens the modal
				}
			} catch (err) {
				console.error("Erreur parsing pendingReview :", err);
			}
			localStorage.removeItem("pendingReview");
		}
	}, [attractionId]);

	// When the carousel changes, update the current selected index
	const onSelect = useCallback(() => {
		if (!emblaApi) return;
		setSelectedIndex(emblaApi.selectedScrollSnap());
	}, [emblaApi]);

	// Attach / detach the carousel's select listener
	useEffect(() => {
		if (!emblaApi) return;

		emblaApi.on("select", onSelect);
		return () => {
			emblaApi.off("select", onSelect);
		};
	}, [emblaApi, onSelect]);

	// Add a new review to the top of the list and reset the carousel position
	const handleNewReview = (newReview: Review) => {
		setReviews((prev) => [newReview, ...prev]);
		setShowModal(false);
		emblaApi?.scrollTo(0);
	};

	return (
		<div className="mb-16">
			<div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
				{reviews.length > 0 ? (
					<h2 className="text-primary-light font-subtitle uppercase tracking-wide text-2xl">
						Avis des visiteurs
					</h2>
				) : (
					<h2 className="text-primary-light font-subtitle uppercase tracking-wide text-2xl">
						Acun avis pour le moment
					</h2>
				)}
			</div>

			{/* Carousel content */}
			<div ref={emblaRef} className="max-w-3xl  w-full mx-auto">
				<div className="flex gap-4 mx-auto ">
					{reviews.map((r) => (
						<ReviewCard key={r.id} review={r} />
					))}
				</div>
			</div>

			{/* Dots navigation */}
			<ul className="mt-4 flex justify-center gap-2">
				{reviews.map((_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: usage de l’index ok (liste statique, carrousel embla)
					<li key={i}>
						<button
							type="button"
							onClick={() => emblaApi?.scrollTo(i)}
							className={`size-3 rounded-full transition ${
								selectedIndex === i ? "bg-primary" : "bg-muted"
							}`}
						/>
					</li>
				))}
			</ul>

			{/* Button to open the review modal */}
			<div className="text-center mt-6">
				<button
					type="button"
					onClick={() => setShowModal(true)}
					className="inline-block rounded-lg bg-primary px-6 py-2 font-bold text-bg transition hover:bg-primary-dark "
				>
					Ajouter un avis
				</button>
			</div>
			{/* Modal for submitting a review */}
			{showModal && (
				<ReviewModal
					attractionId={attractionId}
					onClose={() => setShowModal(false)}
					onSubmit={handleNewReview}
					initialComment={initialComment}
					initialRating={initialRating}
				/>
			)}
		</div>
	);
}
