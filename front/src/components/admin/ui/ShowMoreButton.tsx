type Props = {
	hasMore: boolean;
	onClick: () => void;
};

export default function ShowMoreButton({ hasMore, onClick }: Props) {
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
