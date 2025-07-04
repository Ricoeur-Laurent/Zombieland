// src/components/Burger.tsx
"use client";

import { Menu, User, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
	{ href: "/attractions", label: "Attractions" },
	{ href: "/infos-pratiques", label: "Infos pratiques" },
	{ href: "/contact", label: "Contact" },
];

export default function Burger() {
	const [open, setOpen] = useState(false);

	// Empêche le scroll quand le drawer est ouvert
	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "";
	}, [open]);

	return (
		<>
			{/* Icônes visibles sur mobile only */}
			<div className="flex items-center gap-3 lg:hidden">
				<button
					type="button"
					aria-label="Connexion"
					className="rounded-full p-2 transition hover:bg-surface/60"
				>
					<User className="h-6 w-6" />
				</button>

				<button
					type="button"
					aria-label="Ouvrir le menu"
					onClick={() => setOpen(true)}
					className="rounded p-2 transition hover:bg-surface/60"
				>
					<Menu className="h-7 w-7" />
				</button>
			</div>

			{/* Drawer */}
			{open && (
				<div className="fixed inset-0 z-50 flex flex-col bg-bg/95 px-6 py-8 text-xl font-subtitle uppercase backdrop-blur">
					<button
						type="button"
						aria-label="Fermer le menu"
						onClick={() => setOpen(false)}
						className="self-end rounded p-2 transition hover:bg-surface/60"
					>
						<X className="h-7 w-7" />
					</button>

					<ul className="mt-8 flex flex-grow flex-col gap-6">
						{links.map(({ href, label }) => (
							<li key={href}>
								<Link
									href={href}
									onClick={() => setOpen(false)}
									className="block py-2 transition-colors hover:text-primary"
								>
									{label}
								</Link>
							</li>
						))}

						<li className="mt-auto">
							<Link
								href="/reservations"
								onClick={() => setOpen(false)}
								className="block rounded-lg bg-primary px-5 py-3 text-center font-bold text-bg transition hover:bg-primary-dark"
							>
								Réserver
							</Link>
						</li>
					</ul>
				</div>
			)}
		</>
	);
}
