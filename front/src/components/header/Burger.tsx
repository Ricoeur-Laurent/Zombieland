"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import BurgerProfil from "./BurgerProfil";

/* Les props pour injecter les liens depuis Header */
export default function Burger({
	links,
}: {
	links: { href: string; label: string }[];
}) {
	const [open, setOpen] = useState(false);

	/* Bloque le scroll quand le drawer est ouvert */
	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "";
	}, [open]);

	return (
		<>
			{/* Boutons visibles uniquement en mobile */}

			<div className="flex items-center gap-3 lg:hidden">
				{/* Connexion (placeholder) */}
				<div className="hidden sm:block">
					<BurgerProfil />
				</div>

				{/* Burger */}
				<button
					type="button"
					aria-label="Ouvrir le menu"
					onClick={() => setOpen(true)}
					className="rounded p-2  active:bg-primary/40 "
				>
					<Menu className="h-7 w-7 text-primary" />
				</button>
			</div>

			{/* Drawer pleine largeur : liens principaux */}
			{open && (
				<div className="fixed inset-0 z-50 flex flex-col bg-bg/95 px-6 py-8 text-xl font-subtitle uppercase backdrop-blur">
					{/* Bouton fermeture */}
					<button
						type="button"
						aria-label="Fermer le menu"
						onClick={() => setOpen(false)}
						className="self-end rounded p-2 transition"
					>
						<X className="h-7 w-7 text-primary  active:bg-primary/40" />
					</button>

					<ul className="mt-8 flex flex-grow flex-col gap-6">
						{links.map(({ href, label }) => (
							<li key={href}>
								<Link
									href={href}
									onClick={() => setOpen(false)}
									className="block py-2 transition-colors text-primary-light hover:text-primary"
								>
									{label}
								</Link>
							</li>
						))}
						<li className="block sm:hidden">
							<BurgerProfil onOpenProfil={() => setOpen(false)} />
						</li>
					</ul>
				</div>
			)}
		</>
	);
}
