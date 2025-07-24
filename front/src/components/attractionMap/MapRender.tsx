"use client";

import dynamic from "next/dynamic";

// Import dynamic
const SafeInteractiveMap = dynamic(
	() => import("@/components/attractionMap/AttractionMap"),
	{
		ssr: false,
	},
);

export default function MapRender() {
	return <SafeInteractiveMap />;
}
