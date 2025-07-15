import he from "he"; // decode HTML
import { Edit, Trash2 } from "lucide-react";

type Item = {
	id: number;
	name: string;
};

type ItemListProps = {
	items: Item[];
	onEdit?: (index: number) => void;
	onDelete?: (index: number) => void;
};

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
