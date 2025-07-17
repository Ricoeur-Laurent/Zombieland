// src/components/map/Map.tsx
"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default Leaflet icon paths when using bundlers like Webpack or Vite.
// Without this, icons will not display properly (404 errors).
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
	iconUrl: "/leaflet/marker-icon.png",
	shadowUrl: "/leaflet/marker-shadow.png",
});

export default function MapComponent() {
	return (
		<MapContainer
			center={[47.9811, 2.7519]} // Initial center of the map (latitude, longitude)
			zoom={13}
			style={{ height: "400px", width: "100%" }}
			className="z-0"
		>
			<TileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution="© OpenStreetMap"
			/>
			<Marker position={[47.9811, 2.7519]}>
				<Popup>Ici, c’est ZombieLand !</Popup>
			</Marker>
		</MapContainer>
	);
}
