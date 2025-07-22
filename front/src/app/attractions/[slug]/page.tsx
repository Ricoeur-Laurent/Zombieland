import { notFound } from "next/navigation";
import AttractionDetails from "@/components/attraction/AttractionDetails";
import CarouselReviews from "@/components/attractionReview/CarouselReviews";
import { getApiUrl } from "@/utils/getApi";
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
