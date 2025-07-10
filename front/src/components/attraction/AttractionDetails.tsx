"use client";

import Image from "next/image";
import Link from "next/link";
import type { Attraction } from "@/@types";

export default function AttractionDetails({
	attraction,
}: {
	attraction: Attraction;
}) {
	return (
		<div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
			{/* Lien retour */}
			<Link href="/attractions" className="text-primary hover:underline">
				← Retour aux attractions
			</Link>

			{/* Image */}
			<div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden border-2 border-primary">
				<Image
					src={`/images/desktop/${attraction.id}.webp`}
					alt={attraction.name}
					fill
					className="object-cover"
				/>
			</div>

			{/* Titre */}
			<h1 className="text-3xl md:text-4xl font-subtitle text-primary-light">
				{attraction.name}
			</h1>

			{/* Description */}
			<article className="prose prose-invert max-w-none">
				<p>{attraction.description}</p>
			</article>
		</div>
	);
}
