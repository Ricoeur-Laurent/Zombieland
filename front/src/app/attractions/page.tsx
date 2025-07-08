"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { attractions } from "@/data/attractions";

export default function AttractionsPage() {
	/* 1 · State search + category  */
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState("");

	const [visible, setVisible] = useState(4); // on commence à 4
	const step = 4;
	/* 2 · Filter */
	const filtered = attractions.filter((a) => {
		const matchName = a.title.toLowerCase().includes(query.toLowerCase());
		const matchCat = category ? a.category === category : true;
		return matchName && matchCat;
	});

	const visibleItems = filtered.slice(0, visible);
	const hasMore = visible < filtered.length;

	return (
		<div className="px-4 py-6 max-w-6xl mx-auto">
			<h2 className="text-center text-3xl sm:text-5xl font-subtitle uppercase text-primary mb-8">
				Les attractions
			</h2>

			{/* search bar & category*/}
			<div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center">
				<label className="relative w-full">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted size-5" />
					<input
						type="search"
						placeholder="Rechercher..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="w-full pl-10 pr-4 py-2 rounded-md bg-surface text-text border border-muted focus:outline-none"
					/>
				</label>

				<select
					value={category}
					onChange={(e) => setCategory(e.target.value)}
					className="w-full sm:w-1/2 px-3 py-2 rounded-md bg-surface text-text border border-muted"
				>
					<option value="">Catégories</option>
					<option value="Survival">Survival</option>
					<option value="Escape Game">Escape&nbsp;Game</option>
					<option value="Manège">Manège</option>
					<option value="Paintball">Paintball</option>
					<option value="Simulation urbaine">Simulation urbaine</option>
					<option value="VR">VR</option>
				</select>
			</div>

			{/* filter list */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{visibleItems.map((a) => (
					<Link key={a.id} href={`/attractions/${a.slug}`} className="block">
						<article className="aspect-video relative overflow-hidden rounded-lg border-2 border-primary">
							<Image
								src={a.image}
								alt={a.title}
								fill
								className="object-cover"
								sizes="(max-width:640px)100vw,(max-width:1024px)50vw,33vw"
								loading="lazy"
							/>
							<div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/70 to-transparent">
								<h3 className="text-white text-xl font-title">{a.title}</h3>
							</div>
						</article>
					</Link>
				))}
				{filtered.length === 0 && (
					<p className="text-center col-span-full text-muted">
						Aucune attraction ne correspond à votre recherche.
					</p>
				)}
			</div>

			{/*button show more*/}
			{hasMore && (
				<div className="text-center mt-6">
					<button
						type="button"
						onClick={() => setVisible((v) => v + step)}
						className="bg-primary text-bg px-6 py-2 rounded-lg font-bold hover:bg-primary-dark"
					>
						En voir plus
					</button>
				</div>
			)}
		</div>
	);
}
