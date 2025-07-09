import { notFound } from "next/navigation";
import type { Attraction } from "@/@types";
import AttractionDetails from "@/components/attraction/AttractionDetails";

export default async function AttractionPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	/* fetch one attraction */
	const res = await fetch(`http://localhost:5000/attractions/slug/${slug}`, {});

	if (!res.ok) {
		notFound(); // 404 automatic
	}

	const { oneAttraction }: { oneAttraction: Attraction } = await res.json();

	return <AttractionDetails attraction={oneAttraction} />;
}
