import he from "he"; // decode HTML entities (e.g., &amp; → &)
import { Edit, Trash2 } from "lucide-react";

// Each item in the list has an ID and a name
type Item = {
	id: number;
	name: string;
};

// Props for the ItemList component
type ItemListProps = {
	items: Item[];
	onEdit?: (index: number) => void;
	onDelete?: (index: number) => void;
};

// Reusable list component with optional edit and delete actions
export default function ItemList({
	items = [],
	onEdit,
	onDelete,
}: ItemListProps) {
	return (
		<ul className="space-y-2">
			{items.map((item, i) => (
				<li
					key={item.id}
					className="flex justify-between items-center px-4 py-2 bg-surface border border-muted rounded"
				>
					<span>{he.decode(item.name)}</span>
					<div className="flex gap-2">
						<Edit
							className="size-4 text-primary cursor-pointer"
							onClick={() => onEdit?.(i)}
						/>
						<Trash2
							className="size-4 text-red-500 cursor-pointer"
							onClick={() => onDelete?.(i)}
						/>
					</div>
				</li>
			))}
		</ul>
	);
}
