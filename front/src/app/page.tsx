import type { Attraction } from "@/@types";
import CarouselAttractions from "@/components/CarouselAttractions";
import HeroSection from "@/components/HeroSection";

const attractions: Attraction[] = [
	{ id: 1, title: "Le Manoir…", img: "/images/desktop/manoir.webp" },
	{ id: 2, title: "Prison Hors du Temps", img: "/images/desktop/prison.webp" },
	{ id: 3, title: "Tunnel Sans Retour", img: "/images/desktop/tunnel.webp" },
];

export default function Home() {
	return (
		<>
			{/* Contenu principal de ta page */}
			<main>
				<HeroSection />
				<section className="py-16">
					<CarouselAttractions items={attractions} />
				</section>
			</main>
		</>
	);
}
