import CarouselAttractions from "@/components/homePage/CarouselAttractions";
import HeroSection from "@/components/homePage/HeroSection";
import PrepareVisit from "@/components/homePage/PrepareVisit";

// import { attractions } from "@/data/attractions";

// const carouselItems = attractions.slice(0, 4);

export default function Home() {
	return (
		<>
			{/* Contenu principal de ta page */}
			<main>
				<HeroSection />
				<section className="py-16">
					<CarouselAttractions />
				</section>
				<section className="py-16">
					<PrepareVisit />
				</section>
			</main>
		</>
	);
}
