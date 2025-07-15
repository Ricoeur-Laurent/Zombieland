import SectionHeader from "./SectionHeader";
import ItemList from "./ItemList";

type Props = {
	title: string;
	items: string[];
};

export default function AdminSection({ title, items }: Props) {
	return (
		<section className="mb-10">
			<SectionHeader title={title} />
			<ItemList items={items} />
		</section>
	);
}
