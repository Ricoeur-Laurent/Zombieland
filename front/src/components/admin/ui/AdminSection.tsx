

import SectionHeader from "./SectionHeader";

type Props = {
	title: string;
	onCreate?: () => void;
	children?: React.ReactNode;
};

export default function AdminSection({ title, onCreate, children }: Props) {
	return (
		<section className="mb-10 text-text font-body">
			<SectionHeader title={title} onCreate={onCreate} />
			{children}
		</section>
	);
}