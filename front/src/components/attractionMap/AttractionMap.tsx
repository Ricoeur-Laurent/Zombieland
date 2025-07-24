"use client";

import { ImageOverlay, MapContainer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";

type Attraction = {
	name: string;
	slug: string;
	position: [number, number]; // ← Tuple explicite
};

// Dimensions réelles de l’image
const imageSize = 1024;

const imageBounds: [[number, number], [number, number]] = [
	[0, 0],
	[imageSize, imageSize],
];

const center: [number, number] = [imageSize / 2, imageSize / 2];

const attractions: Attraction[] = [
	{
		name: "Le Dédale Maudit",
		slug: "le-dédale-maudit",
		position: [567.3, 368.4],
	},
	{
		name: "Speed Apocalypse",
		slug: "speed-apocalypse",
		position: [474.6, 479.46],
	},
	{
		name: "Le Manoir des Ames Perdues",
		slug: "le-manoir-des-âmes-perdues",
		position: [52.46, 749.08],
	},
	{
		name: "L’Enfer en Soins Intensifs",
		slug: "lenfer-en-soins-intensifs",
		position: [430.86, 718.58],
	},
	{
		name: "Le Virus Express",
		slug: "le-virus-express",
		position: [195.2, 564.86],
	},
	{
		name: "Vertige Mortel",
		slug: "vertige-mortel",
		position: [69.54, 399.76],
	},
	{
		name: "Chasse Mortelle",
		slug: "chasse-mortelle",
		position: [135.42, 883.28],
	},
	{
		name: "Prison Hors du Temps",
		slug: "prison-hors-du-temps",
		position: [705.94, 851.34],
	},
	{
		name: "Clinique du Chaos",
		slug: "clinique-du-chaos",
		position: [787.9, 488],
	},
	{
		name: "Les Ombres du Cimetière",
		slug: "les-ombres-du-cimetière",
		position: [1006.9, 671],
	},
	{
		name: "Les Bois Maudits",
		slug: "les-bois-maudits",
		position: [344.04, 867.42],
	},
	{
		name: "Route Z",
		slug: "route-z",
		position: [647.82, 651.48],
	},
	{
		name: "Tunnel Sans Retour",
		slug: "tunnel-sans-retour",
		position: [481.9, 883.28],
	},
];

export default function InteractiveMap() {
	const zombieIcon = L.icon({
		iconUrl: "leaflet/icon-map.png",
		iconSize: [24, 36],
		iconAnchor: [12, 36],
		popupAnchor: [0, -36],
	});

	return (
		<div className="w-full h-[60vh] overflow-hidden rounded-md">
			<MapContainer
				crs={L.CRS.Simple}
				center={center}
				zoom={0}
				minZoom={0}
				maxZoom={4}
				maxBounds={imageBounds}
				maxBoundsViscosity={1.0}
				style={{ width: "100%", height: "100%" }}
				className="z-0"
			>
				<ImageOverlay
					url="/images/zombieland-map-isometric.webp"
					bounds={imageBounds}
				/>

				{attractions.map((attr) => (
					<Marker key={attr.slug} position={attr.position} icon={zombieIcon}>
						<Popup>
							<strong>{attr.name}</strong>
							<br />
							<Link href={`/attractions/${attr.slug}`}>Voir l'attraction</Link>
						</Popup>
					</Marker>
				))}
			</MapContainer>
		</div>
	);
}
