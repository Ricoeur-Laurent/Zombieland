// src/components/map/MapWrapper.tsx
"use client";

import dynamic from "next/dynamic";

const ParkMap = dynamic(() => import("./Map"), {
	ssr: false,
	loading: () => <p>Chargement de la carte...</p>,
});

export default function MapWrapper() {
	return <ParkMap />;
}
