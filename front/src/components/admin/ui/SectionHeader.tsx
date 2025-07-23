import { Plus } from "lucide-react";

// Header for an admin section, with optional "create" button
type Props = {
	title: string;
	onCreate?: () => void;
};

export default function SectionHeader({ title, onCreate }: Props) {
	return (
		<div className="flex justify-between items-center mb-3">
			<h2 className="text-xl font-subtitle text-primary-light">{title}</h2>
			<button
				type="button"
				className="text-primary hover:text-primary-dark"
				onClick={onCreate}
			>
				<Plus />
			</button>
		</div>
	);
}
