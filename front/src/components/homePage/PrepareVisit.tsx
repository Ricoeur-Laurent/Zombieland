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
			className="w-full px-4 py-16 bg-gradient-to-b from-black/50 to-zinc-900/0"
		>
			<div className="text-center mb-10">
				<h2 className="text-3xl sm:text-4xl font-subtitle text-primary-light uppercase">
					Préparez votre mission de survie
				</h2>
				<p className="text-zinc-400 text-sm mt-2">
					Toutes les infos pratiques avant de plonger dans le chaos.
				</p>
			</div>

			<ul className="mx-auto max-w-5xl grid grid-cols-2 sm:grid-cols-3 gap-6 px-2">
				{items.map(({ label, icon: Icon, href }) => (
					<li key={label}>
						<Link
							href={href}
							className="group flex flex-col items-center gap-4 bg-zinc-800/80 hover:bg-zinc-700 transition-colors p-6 rounded-xl text-center shadow-md hover:shadow-lg"
						>
							<div className="bg-primary/20 group-hover:bg-primary p-3 rounded-full">
								<Icon
									className="w-6 h-6 text-primary group-hover:text-white transition"
									aria-hidden
								/>
							</div>
							<span className="font-subtitle tracking-wide text-text group-hover:text-white sm:text-lg">
								{label}
							</span>
						</Link>
					</li>
				))}
			</ul>
		</section>
	);
}
