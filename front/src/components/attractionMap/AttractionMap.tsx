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
const imageSize = 1100;

const imageBounds: [[number, number], [number, number]] = [
	[0, 0],
	[imageSize, imageSize],
];

const center: [number, number] = [imageSize / 2, imageSize / 2];

const attractions: Attraction[] = [
  {
    name: "Le Dédale Maudit",
    slug: "le-dédale-maudit",
    position: [481.0, 614.0]
  },
  {
    name: "Speed Apocalypse",
    slug: "speed-apocalypse",
    position: [630.0, 346.0]
  },
  {
    name: "Le Manoir des Ames Perdues",
    slug: "le-manoir-des-âmes-perdues",
    position: [955.0, 725.0]
  },
  {
    name: "L’Enfer en Soins Intensifs",
    slug: "lenfer-en-soins-intensifs",
    position: [578.0, 154.0]
  },
  {
    name: "Le Virus Express",
    slug: "le-virus-express",
    position: [807.0, 473.0]
  },
  {
    name: "Vertige Mortel",
    slug: "vertige-mortel",
    position: [975.0, 234.0]
  },
  {
    name: "Chasse Mortelle",
    slug: "chasse-mortelle",
    position: [696.0, 742.0]
  },
  {
    name: "Prison Hors du Temps",
    slug: "prison-hors-du-temps",
    position: [980.0, 520.0]
  },
  {
    name: "Clinique du Chaos",
    slug: "clinique-du-chaos",
    position: [364.0, 390.0]
  },
  {
    name: "Les Ombres du Cimetière",
    slug: "les-ombres-du-cimetière",
    position: [129.0, 619.0]
  },
  {
    name: "Les Bois Maudits",
    slug: "les-bois-maudits",
    position: [757.0, 933.0],
   
  },
  {
    name: "Route Z",
    slug: "route-z",
    position: [214.0, 890.0]
  },
  {
    name: "Tunnel Sans Retour",
    slug: "tunnel-sans-retour",
    position: [647.0, 937.0]
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
