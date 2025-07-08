import {
	Accessibility,
	Clock,
	HelpCircle,
	MapPin,
	ParkingSquare,
	Ticket,
} from "lucide-react";
import Link from "next/link";

const items = [
	{ label: "Horaires", icon: Clock, href: "/infos-pratiques#horaires" },
	{ label: "Billets", icon: Ticket, href: "/infos-pratiques#billets" },
	{ label: "Accès", icon: MapPin, href: "/infos-pratiques#acces" },
	{ label: "Parking", icon: ParkingSquare, href: "/infos-pratiques#parking" },
	{ label: "Contact", icon: HelpCircle, href: "/infos-pratiques#contact" },
	{ label: "PMR", icon: Accessibility, href: "/infos-pratiques#pmr" },
];

export default function PrepareVisit() {
	return (
		<section
			aria-labelledby="prepare-title"
			className="w-full px-4 bg-black/40 py-12 backdrop-brightness-90"
		>
			<h2
				id="prepare-title"
				className="text-center text-2xl sm:text-4xl font-subtitle text-text uppercase"
			>
				Préparez votre visite&nbsp;!
			</h2>

			<ul className="mt-8 mx-auto max-w-4xl grid grid-cols-2 md:grid-cols-3 gap-y-6">
				{items.map(({ label, icon: Icon, href }) => (
					<li key={label} className="flex justify-center">
						<Link
							href={href}
							className="flex items-start gap-3  w-full max-w-[200px] text-primary-light hover:text-primary transition"
						>
							<Icon className="size-8 text-primary" aria-hidden />
							<span className="font-subtitle tracking-wide sm:text-2xl">
								{label}
							</span>
						</Link>
					</li>
				))}
			</ul>
		</section>
	);
}
