import {
	Accessibility,
	Clock,
	HelpCircle,
	MapPin,
	ParkingSquare,
	Ticket,
} from "lucide-react";

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
				<ul className="list-disc list-inside ml-4 mt-2">
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
				<p className="mt-2">
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
				Parking gratuit de 666 places, dont des emplacements réservés aux PMR,
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
				<p>Email : zombie@zombie.com</p>
				<p>Tél : 0666.66.66.66</p>
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
		<div className="max-w-4xl mx-auto px-4 py-12">
			<h1 className="text-center text-3xl sm:text-5xl font-subtitle uppercase text-primary mb-8">
				Infos pratiques
			</h1>

			<div className="mt-12 space-y-12">
				{sections.map(({ id, title, icon: Icon, content }) => (
					<section key={id} id={id} className="scroll-mt-20">
						<div className="flex items-center gap-3 mb-4">
							<Icon className="size-7 text-primary" aria-hidden />
							<h2 className="text-xl sm:text-2xl font-subtitle uppercase tracking-wide text-text">
								{title}
							</h2>
						</div>
						<div className="text-text text-base leading-relaxed">{content}</div>
					</section>
				))}
			</div>
		</div>
	);
}
