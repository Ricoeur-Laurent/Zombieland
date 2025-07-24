import MapRender from "@/components/attractionMap/MapRender";

export const metadata = {
	title: "Plan du parc – ZombieLand",
	description:
		"Découvrez le plan interactif du parc ZombieLand avec toutes les attractions à explorer. Zoomez, explorez et localisez chaque zone de terreur !",
};

export default function MapPage() {
	return (
		<div className="px-4 sm:px-6 md:px-8 py-10 max-w-6xl mx-auto">
			<h2 className="text-center text-3xl sm:text-5xl font-subtitle uppercase text-primary mb-8">
				Plan du parc
			</h2>
			<div className=" relative  rounded-lg border-l-4 border-primary shadow-md overflow-hidden ">
				<MapRender />
			</div>
		</div>
	);
}
