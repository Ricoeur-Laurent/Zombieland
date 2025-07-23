import {
	Accessibility,
	Clock,
	HelpCircle,
	MapPin,
	ParkingSquare,
	Ticket,
} from "lucide-react";
import MapWrapper from "@/components/map/MapWrraper"; // attention à l'orthographe : MapWrapper

export const metadata = {
	title: "Infos pratiques – Zombieland",
	description: "Horaires, billets, accès, parking, contact et infos PMR",
};

const sections = [
	{
		id: "horaires",
		title: "Horaires",
		icon: Clock,
		content: (
			<>
				<p>Le parc est ouvert :</p>
				<ul className="list-disc list-inside ml-4 mt-2 space-y-1">
					<li>Du mercredi au dimanche : 10h – 22h</li>
					<li>Vacances & jours fériés : 7j/7</li>
					<li>Fermeture annuelle : janvier</li>
				</ul>
			</>
		),
	},
	{
		id: "billets",
		title: "Billets",
		icon: Ticket,
		content: (
			<p>Achetez vos billets en ligne ou sur place. Tarif unique de 66€.</p>
		),
	},
	{
		id: "acces",
		title: "Accès",
		icon: MapPin,
		content: (
			<>
				<p>
					Zombieland se situe à seulement 20 minutes de la gare de Montargis.
					Accès en voiture via la D2060, sortie Z.
				</p>
				<div className="mt-4 rounded-lg overflow-hidden border border-muted shadow-sm">
					<MapWrapper />
				</div>
				<p className="mt-4">
					<strong>Adresse :</strong>
					<br />
					Zombieland
					<br />
					13 Rue des Morts-Vivants
					<br />
					45200 Amilly
				</p>
			</>
		),
	},
	{
		id: "parking",
		title: "Parking",
		icon: ParkingSquare,
		content: (
			<p>
				Parking gratuit de 666 places, avec des emplacements réservés aux PMR,
				vélos et motos.
			</p>
		),
	},
	{
		id: "contact",
		title: "Contact",
		icon: HelpCircle,
		content: (
			<>
				<p>
					Email :{" "}
					<a
						href="mailto:zombieland.zombieland666@gmail.com"
						className="text-primary hover:underline"
					>
						zombieland.zombieland666@gmail.com
					</a>
				</p>
				<p>
					Tél :{" "}
					<a href="tel:0666666666" className="text-primary hover:underline">
						0666.66.66.66
					</a>
				</p>
			</>
		),
	},
	{
		id: "pmr",
		title: "Accessibilité PMR",
		icon: Accessibility,
		content: (
			<p>
				Le parc est accessible aux personnes à mobilité réduite : entrées
				adaptées, toilettes, parkings et accompagnement sur demande.
			</p>
		),
	},
];

export default function VisitorInfoPage() {
	return (
		<div className="px-4 sm:px-6 md:px-8 py-10 max-w-6xl mx-auto">
			<h2 className="text-center text-3xl sm:text-5xl font-subtitle uppercase text-primary mb-8">
				Infos pratiques
			</h2>

			<div className="mt-12 grid gap-10 sm:gap-12">
				{sections.map(({ id, title, icon: Icon, content }) => (
					<section
						key={id}
						id={id}
						className=" bg-surface/70 p-6 sm:p-8 rounded-lg border-l-4 border-primary shadow-md "
					>
						<div className="flex items-center gap-3 mb-4">
							<Icon className="size-7 text-primary" aria-hidden />
							<h3 className="text-xl sm:text-2xl font-subtitle uppercase tracking-wide text-text">
								{title}
							</h3>
						</div>
						<div className="text-text text-base leading-relaxed">{content}</div>
					</section>
				))}
			</div>
		</div>
	);
}
