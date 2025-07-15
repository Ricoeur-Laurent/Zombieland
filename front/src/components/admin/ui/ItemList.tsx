import { Edit, Trash2 } from "lucide-react";

export default function ItemList({ items }: { items: string[] }) {
	return (
		<ul className="space-y-2">
			{items.map((item, i) => (
				<li
					key={i}
					className="flex justify-between items-center px-4 py-2 bg-surface border border-muted rounded"
				>
					<span>{item}</span>
					<div className="flex gap-2">
						<Edit className="size-4 text-primary cursor-pointer" />
						<Trash2 className="size-4 text-red-500 cursor-pointer" />
					</div>
				</li>
			))}
		</ul>
	);
}
