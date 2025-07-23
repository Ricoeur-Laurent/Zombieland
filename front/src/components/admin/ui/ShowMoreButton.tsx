type Props = {
	hasMore: boolean; // Whether there are more items to show
	onClick: () => void; // Called when user clicks "Show more"
};

export default function ShowMoreButton({ hasMore, onClick }: Props) {
	// Hide the button if there's nothing more to load
	if (!hasMore) return null;

	return (
		<div className="text-center mt-6">
			<button
				type="button"
				onClick={onClick}
				className="bg-primary text-bg px-6 py-2 rounded-lg font-bold hover:bg-primary-dark"
			>
				Afficher plus
			</button>
		</div>
	);
}
