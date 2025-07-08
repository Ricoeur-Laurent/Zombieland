import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Attraction } from "@/@types";
import { attractions } from "@/data/attractions";

interface PageProps {
	params: { slug: string };
}

export function generateMetadata({ params }: PageProps) {
	const attr = attractions.find((a) => a.slug === params.slug);
	if (!attr) return { title: "Attraction introuvable – Zombieland" };
	return {
		title: `${attr.title} – Zombieland`,
		description: attr.excerpt,
	};
}

export default function AttractionPage({ params }: PageProps) {
	const attraction: Attraction | undefined = attractions.find(
		(a) => a.slug === params.slug,
	);

	if (!attraction) {
		notFound(); /*automatic 404*/
	}

	return (
		<div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
			<Link href="/attractions" className="text-primary hover:underline">
				← Retour aux attractions
			</Link>

			{/* Image  */}
			<div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden border-2 border-primary">
				<Image
					src={attraction.image}
					alt={attraction.title}
					fill
					className="object-cover"
					priority
				/>
			</div>

			{/* Title and category*/}
			<div>
				<h1 className="text-3xl md:text-4xl font-subtitle text-primary-light mb-2">
					{attraction.title}
				</h1>
				<p className="uppercase  tracking-wider">{attraction.category}</p>
			</div>

			{/* Infos  */}

			{/* Description  */}
			<article className="prose prose-invert max-w-none">
				<p>{attraction.description}</p>
			</article>
		</div>
	);
}
