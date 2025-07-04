import Link from "next/link";
import Burger from "./Burger";
import BurgerProfil from "./BurgerProfil";

/* Liens qui DOIVENT apparaître dans la nav (et le burger) */
const links = [
	{ href: "/attractions", label: "Attractions" },
	{ href: "/infos-pratiques", label: "Infos pratiques" },
	{ href: "/reservations", label: "Réservations" },
];

export default function Header() {
	return (
		<header className="sticky top-0 z-50 w-full  shadow-lg">
			<nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-6">
				{/* Logo  */}
				<Link
					href="/"
					className="text-4xl font-title tracking-widest text-primary"
				>
					ZombieLand
				</Link>

				{/* Bouton “Réserver” — visible partout  */}
				<div className="flex gap-6">
					<Link
						href="/reservations"
						className="rounded-lg bg-primary px-5 py-2 font-bold text-bg transition hover:bg-primary-dark lg:hidden"
					>
						Réserver
					</Link>
					{/* Burger (mobile only) */}
					<Burger links={links} />
					{/* Nav desktop  */}
					<div className="hidden items-center gap-6 lg:flex">
						<ul className="flex items-center gap-8 text-lg font-subtitle uppercase">
							{links.map(({ href, label }) => (
								<li key={href}>
									<Link
										href={href}
										className="transition-colors text-primary-light hover:text-primary"
									>
										{label}
									</Link>
								</li>
							))}
						</ul>
						{/* Bouton “Réserver” desktop */}
						<Link
							href="/reservations"
							className="rounded-lg bg-primary px-5 py-2 font-bold text-bg transition hover:bg-primary-dark"
						>
							Réserver
						</Link>
						{/* Icône user */}
						<div className="rounded-full p-2 transition ">
							<BurgerProfil />
						</div>
					</div>
				</div>
			</nav>
		</header>
	);
}
