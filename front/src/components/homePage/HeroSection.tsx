// src/components/HeroSection.tsx

import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
	return (
		<section className="relative w-full h-[90vh] flex items-center justify-center">
			{/* Image */}
			<Image
				src="/images/desktop/entree.webp"
				alt="ZombieLand - Parc post-apocalyptique"
				fill
				className="object-cover"
			/>

			{/* Overlay */}
			<div className="absolute inset-0 bg-black/40 flex items-center justify-center px-4">
				<div className="bg-surface/80 p-6 sm:p-10 max-w-xl text-center rounded-lg">
					<h2 className="text-primary-light font-subtitle uppercase text-2xl sm:text-4xl mb-4">
						BIENVENUE À ZOMBIELAND
					</h2>
					<p className="text-text font-body text-sm sm:text-base mb-6 text-justify">
						Bienvenue à ZombieLand : entrez si vous l’osez... Dans un monde
						ravagé par l’apocalypse, une seule zone a su résister au chaos :
						ZombieLand. Ce parc d’attractions unique en son genre vous propose
						une expérience à couper le souffle, au cœur d’un univers
						post-apocalyptique plus vrai que nature. Affrontez vos peurs, testez
						vos limites et tentez de survivre à nos attractions plus
						terrifiantes les unes que les autres. Frissons garantis… ou
						remboursement dans l’au-delà.
					</p>
					<Link
						href="/reservations"
						className="inline-block rounded-lg bg-primary px-6 py-2 font-bold text-bg transition hover:bg-primary-dark uppercase"
					>
						Réservations
					</Link>
				</div>
			</div>
		</section>
	);
}
