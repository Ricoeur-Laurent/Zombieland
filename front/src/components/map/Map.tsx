// src/components/map/Map.tsx
"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Corriger les icônes par défaut de Leaflet (sinon ils sont cassés)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
	iconUrl: "/leaflet/marker-icon.png",
	shadowUrl: "/leaflet/marker-shadow.png",
});

export default function MapComponent() {
	return (
		<MapContainer
			center={[48.8584, 2.2945]}
			zoom={13}
			style={{ height: "400px", width: "100%" }}
		>
			<TileLayer
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				attribution="© OpenStreetMap"
			/>
			<Marker position={[48.8584, 2.2945]}>
				<Popup>Ici, c’est ZombieLand !</Popup>
			</Marker>
		</MapContainer>
	);
}
