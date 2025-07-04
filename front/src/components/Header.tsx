import { User } from "lucide-react";
import Link from "next/link";
import Burger from "./Burger";

const links = [
	{ href: "/attractions", label: "Attractions" },
	{ href: "/infos-pratiques", label: "Infos pratiques" },
	{ href: "/reservations", label: "Réservations" },
];

export default function Header() {
	return (
		<header className="sticky top-0 z-50 w-full bg-surface/80 backdrop-blur shadow-lg">
			<nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-6">
				{/* Logo */}
				<Link
					href="/"
					className="text-4xl font-title tracking-widest text-primary"
				>
					ZombieLand
				</Link>

				{/* Burger (mobile) */}
				<Burger />

				{/* Nav desktop */}
				<ul className="hidden items-center gap-8 text-lg font-subtitle uppercase lg:flex">
					{links.map(({ href, label }) => (
						<li key={href}>
							<Link
								href={href}
								className="transition-colors hover:text-primary"
							>
								{label}
							</Link>
						</li>
					))}

					<li>
						<Link
							href="/reservations"
							className="rounded-lg bg-primary px-5 py-2 font-bold text-bg transition hover:bg-primary-dark"
						>
							Réserver
						</Link>
					</li>

					<li>
						<button
							type="button"
							aria-label="Connexion"
							className="rounded-full p-2 transition hover:bg-surface/60"
						>
							<User className="h-6 w-6" />
						</button>
					</li>
				</ul>
			</nav>
		</header>
	);
}
