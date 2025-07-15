import { Plus } from "lucide-react";

export default function SectionHeader({ title }: { title: string }) {
	return (
		<div className="flex justify-between items-center mb-3">
			<h2 className="text-xl font-subtitle text-primary-light">{title}</h2>
			<button type="button" className="text-primary hover:text-primary-dark">
				<Plus />
			</button>
		</div>
	);
}
