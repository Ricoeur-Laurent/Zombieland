"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Attraction, Category } from "@/@types";
import { getApiUrl } from "@/utils/getApi";

export default function Attractions() {
	/* State search + category  */
	const [query, setQuery] = useState(""); // Search input
	const [selectedCategory, setSelectedCategory] = useState(""); // Selected category
	const [categories, setCategories] = useState<Category[]>([]); // All available categories
	const [attractions, setAttractions] = useState<Attraction[]>([]); // All fetched attractions
	const [visible, setVisible] = useState(4); // Number of visible cards
	const step = 4; // Load more increment

	/*fetch attractions */
	useEffect(() => {
		async function getAttractions() {
			try {
				const httpResponse = await fetch(`${getApiUrl()}/attractions`);
				const data = await httpResponse.json();

				if (httpResponse.ok) {
					setAttractions(data.allAttractions);
				} else {
					throw new Error("L'appel à l'API a échoué, veuillez réessayer...");
				}
			} catch (error) {
				console.log(error);
			}
		}
		getAttractions();
	}, []);

	/*fetch categories */
	useEffect(() => {
		async function getCategories() {
			try {
				const httpResponse = await fetch(`${getApiUrl()}/categories`);
				const data = await httpResponse.json();

				if (httpResponse.ok) {
					setCategories(data.categories);
				} else {
					throw new Error("L'appel à l'API a échoué, veuillez réessayer...");
				}
			} catch (error) {
				console.log(error);
			}
		}
		getCategories();
	}, []);

	/* · Filter */
	const filtered = attractions.filter((a) => {
		const matchName = a.name.toLowerCase().includes(query.toLowerCase());
		const matchCat = selectedCategory
			? a.categories.some((cat) => cat.name === selectedCategory)
			: true;
		return matchName && matchCat;
	});

	const visibleItems = filtered.slice(0, visible);
	const hasMore = visible < filtered.length;

	return (
		<div className="px-4 sm:px-6 md:px-8 py-10 max-w-6xl mx-auto">
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
					value={selectedCategory}
					onChange={(e) => setSelectedCategory(e.target.value)}
					className="w-full sm:w-1/2 px-3 py-2 rounded-md bg-surface text-text border border-muted"
				>
					<option value="">Catégories</option>
					{categories.map((c) => (
						<option key={c.id} value={c.name}>
							{c.name}
						</option>
					))}
				</select>
			</div>

			{/* attractions list */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{visibleItems.map((a) => (
					<Link
						key={a.id}
						href={`/attractions/${a.slug}`}
						className="block group"
					>
						<article className="aspect-video relative overflow-hidden rounded-lg border-2 border-primary">
							<Image
								src={`/images/desktop/${a.id}.webp`}
								alt={a.name}
								fill
								className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:brightness-110"
								sizes="(max-width:640px)100vw,(max-width:1024px)50vw,33vw"
							/>
							<div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/70 to-transparent">
								<h3 className="text-white text-xl font-title">{a.name}</h3>
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
