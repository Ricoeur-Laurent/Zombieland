// src/components/BurgerProfil.tsx
"use client";

import { User, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BurgerProfil() {
	const [open, setOpen] = useState(false);

	/* Bloque le scroll quand le drawer est ouvert */
	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "";
	}, [open]);

	return (
		<>
			{/* bouton User qui déclenche l’ouverture */}
			<button
				type="button"
				aria-label="Profil"
				onClick={() => setOpen(true)}
				className="rounded-full p-2 text-primary 
                    active:bg-primary/40
                   "
			>
				<User className="h-6 w-6" />
			</button>

			{/* drawer Profil */}
			{open && (
				<div className="fixed inset-0 z-50 flex flex-col bg-bg/95 backdrop-blur px-6 py-8 text-xl font-subtitle uppercase">
					{/* close */}
					<button
						type="button"
						aria-label="Fermer"
						onClick={() => setOpen(false)}
						className="self-end rounded p-2 text-primary  active:bg-primary/40"
					>
						<X className="h-7 w-7" />
					</button>

					<ul className="mt-8 flex flex-grow flex-col gap-6">
						<li>
							<Link
								href="/profil"
								onClick={() => setOpen(false)}
								className="flex items-center gap-3 py-2 text-primary-light
                           transition-colors hover:text-primary"
							>
								Mon profil
							</Link>
						</li>
					</ul>
				</div>
			)}
		</>
	);
}
