import SectionHeader from "./SectionHeader";

// Props accepted by the AdminSection component
type Props = {
	title: string;
	onCreate?: () => void;
	children?: React.ReactNode;
};

// Generic layout wrapper for each admin section
export default function AdminSection({ title, onCreate, children }: Props) {
	return (
		<section className="mb-10 text-text ">
			<SectionHeader title={title} onCreate={onCreate} />
			{children}
		</section>
	);
}
