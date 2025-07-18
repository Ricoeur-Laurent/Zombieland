"use client";

import Cookies from "js-cookie";
import { User, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTokenContext } from "@/context/TokenProvider";

export default function BurgerProfil({
	onOpenProfil,
}: {
	onOpenProfil?: () => void;
}) {
	const [open, setOpen] = useState(false);
	const handleOpen = () => {
		if (onOpenProfil) onOpenProfil?.();
		setOpen(false);
	};
	/* Bloque le scroll quand le drawer est ouvert */
	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "";
	}, [open]);
	// we get the token in the burger to check if the user is connected and swap the  burger optin connect/disconnect
	const { user, token, setToken } = useTokenContext();
	const router = useRouter();

	// ...

	const handleLogout = () => {
		// Remove the token from the cookies
		Cookies.remove("zombieland_token");
		// Remove localstorage with logout
		localStorage.removeItem("zombieland_reservation");
		// Clear the token from the context
		setToken(null);

		// Close the burger menu
		setOpen(false);
		handleOpen();

		// Redirect the user to the home page after logout
		router.push("/");
	};

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

					{token ? (
						<ul className="mt-8 flex flex-grow flex-col gap-6">
							<li>
								<Link

									href="/mon-profil"
									onClick={() => setOpen(false)}

									className="flex items-center gap-3 py-2 text-primary-light transition-colors hover:text-primary"
								>
									Mon profil
								</Link>
							</li>

							<li>
								<Link
									href="/mes-reservations"
									onClick={handleOpen}
									className="flex items-center gap-3 py-2 text-primary-light transition-colors hover:text-primary"
								>
									Mes réservations
								</Link>
							</li>
							{/* if admin new link */}
							{user?.admin && (
								<li>
									<Link
										href="/admin"
										onClick={handleOpen}
										className="flex items-center gap-3 py-2 text-red-500 font-bold transition-colors hover:text-red-700"
									>
										Espace Admin
									</Link>
								</li>
							)}

							<li>
								<button
									type="button"
									onClick={handleLogout}
									className="flex items-center gap-3 py-2 text-primary-light transition-colors hover:text-primary"
								>
									Déconnexion
								</button>
							</li>
						</ul>
					) : (
						<ul className="mt-8 flex flex-grow flex-col gap-6">
							<li>
								<Link
									href="/connexion"
									onClick={handleOpen}
									className="flex items-center gap-3 py-2 text-primary-light transition-colors hover:text-primary"
								>
									Connexion
								</Link>
							</li>
							<li>
								<Link
									href="/inscription"
									onClick={handleOpen}
									className="flex items-center gap-3 py-2 text-primary-light transition-colors hover:text-primary"
								>
									Inscription
								</Link>
							</li>
						</ul>
					)}
				</div>
			)}
		</>
	);
}
