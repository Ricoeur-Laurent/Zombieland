import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	devIndicators: {
		buildActivity: false, // désactive l’animation en haut à droite
	},

	// ⛔ désactive le logo "N" :
	telemetry: false,
};

export default nextConfig;
