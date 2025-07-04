import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	devIndicators: {
		buildActivity: false, // ⇦ plus de toast !
		// buildActivityPosition: 'bottom-right' // (optionnel) changer la position
	},
};

export default nextConfig;
