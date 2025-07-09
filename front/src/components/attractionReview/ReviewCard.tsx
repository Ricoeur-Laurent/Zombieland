import type { Review } from "@/@types";

export default function ReviewCard({ review }: { review: Review }) {
	return (
		<article className="min-w-full md:min-w-[50%] lg:min-w-[33.333%] flex-shrink-0 p-4">
			<div className="h-full border-2 border-primary rounded-lg p-4 bg-bg shadow">
				<div className="flex items-center gap-2 mb-2">
					<span className="text-primary">{"⭐".repeat(review.rating)}</span>
				</div>
				<p className="italic">{review.comment}</p>
			</div>
		</article>
	);
}
