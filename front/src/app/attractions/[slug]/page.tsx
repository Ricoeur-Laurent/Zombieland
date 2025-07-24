import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AttractionDetails from "@/components/attraction/AttractionDetails";
import CarouselReviews from "@/components/attractionReview/CarouselReviews";
import { getApiUrl } from "@/utils/getApi";

//  Dynamically set metadata based on attraction slug
export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	try {
		const httpResponse = await fetch(`${getApiUrl()}/attractions/slug/${slug}`);
		if (!httpResponse.ok) throw new Error();

		const data = await httpResponse.json();
		const attraction = data.oneAttraction;

		return {
			title: `${attraction.name} – Zombieland`,
			description: `Découvrez l'attraction "${attraction.name}" : frissons garantis au cœur de Zombieland ! }`,
		};
	} catch (error) {
		console.log(error);
		return {
			title: "Attraction introuvable – Zombieland",
			description:
				"Oups ! Cette attraction semble s’être volatilisée dans les ténèbres...",
		};
	}
}

// This is a dynamic route page for a single attraction, based on its slug.
export default async function AttractionPage({
	params,
}: {
	params: Promise<{ slug: string }>; // TypeScript expects a promise resolving to an object with a slug string
}) {
	const { slug } = await params;

	/* fetch one attraction */

	try {
		const httpResponse = await fetch(`${getApiUrl()}/attractions/slug/${slug}`);

		if (httpResponse.status === 404) {
			notFound(); // Triggers Next.js' built-in 404 page
		}
		if (!httpResponse.ok) {
			// (500, 403, etc.)
			throw new Error(`Erreur serveur: ${httpResponse.status}`);
		}

		const data = await httpResponse.json();
		// Render the details of the attraction and its reviews carousel
		return (
			<>
				<AttractionDetails attraction={data.oneAttraction} />
				<CarouselReviews attractionId={data.oneAttraction.id} />
			</>
		);
	} catch (error) {
		console.log(error);
	}
}
