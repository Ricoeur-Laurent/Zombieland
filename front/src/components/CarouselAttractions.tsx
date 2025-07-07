"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Attraction } from "@/@types";

interface CarouselAttractionsProps {
	items: Attraction[];
}

export default function CarouselAttractions({
	items,
}: CarouselAttractionsProps) {
	const [emblaRef, emblaApi] = useEmblaCarousel({
		loop: true,
		align: "start",
		skipSnaps: false,
	});

	const [selectedIndex, setSelectedIndex] = useState(0);

	const onSelect = useCallback(() => {
		if (!emblaApi) return;
		setSelectedIndex(emblaApi.selectedScrollSnap());
	}, [emblaApi]);

	useEffect(() => {
		if (!emblaApi) return undefined;

		emblaApi.on("select", onSelect);

		const cleanup = () => {
			emblaApi.off("select", onSelect);
		};

		return cleanup;
	}, [emblaApi, onSelect]);

	return (
		<div>
			<Link
				href="/attractions"
				className="block w-max mx-auto mb-8 rounded-lg bg-primary px-6 py-2 
             font-bold text-bg uppercase tracking-widest 
             transition hover:bg-primary-dark shadow-md"
			>
				Toutes nos attractions
			</Link>
			<div ref={emblaRef} className="overflow-hidden w-full mx-auto px-4">
				<div className="flex gap-4">
					{items.map((a) => (
						<div
							key={a.id}
							className="min-w-full md:min-w-[50%] lg:min-w-[33.3333%] flex-shrink-0"
						>
							<Link href={`/attractions/${a.id}`} className="block h-full">
								<article className="relative aspect-video overflow-hidden border-2 border-primary rounded-lg m-3">
									<Image
										src={a.img}
										alt={a.title}
										fill
										sizes="(min-width:1024px) 33vw,
                       (min-width:768px) 50vw,
                       100vw"
										className="object-cover"
									/>

									{/* Overlay titre */}
									<span
										className="absolute inset-0 flex items-end justify-center p-4 text-center bg-gradient-to-t from-black/80 to-transparent
            		 text-white text-xl font-title tracking-wider"
									>
										{a.title}
									</span>
								</article>
							</Link>
						</div>
					))}
				</div>
				{/* Pastilles */}
				<div className="mt-4 flex justify-center gap-3">
					<ul className="mt-4 flex justify-center gap-3">
						{items.map((_, i) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: usage de l’index ok (liste statique, carrousel embla)
							<li key={i}>
								<button
									type="button"
									aria-label={`Aller au slide ${i + 1}`}
									aria-current={selectedIndex === i ? "true" : undefined}
									onClick={() => emblaApi?.scrollTo(i)}
									className={`size-3 rounded-full transition
          ${selectedIndex === i ? "bg-primary" : "bg-muted/50 hover:bg-muted"}`}
								/>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}
