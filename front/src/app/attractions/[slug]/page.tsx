import { notFound } from "next/navigation";
import AttractionDetails from "@/components/attraction/AttractionDetails";
import CarouselReviews from "@/components/attractionReview/CarouselReviews";
import { getApiUrl } from "@/utils/getApi";

export default async function AttractionPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	/* fetch one attraction */

	try {
		const httpResponse = await fetch(`${getApiUrl()}/attractions/slug/${slug}`);

		if (httpResponse.status === 404) {
			notFound(); // 404 automatic
		}
		if (!httpResponse.ok) {
			// (500, 403, etc.)
			throw new Error(`Erreur serveur: ${httpResponse.status}`);
		}

		const data = await httpResponse.json();

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
