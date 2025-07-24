"use client";

import { User, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";

export default function BurgerProfil({
	onOpenProfil,
}: {
	onOpenProfil?: () => void;
}) {
	const [open, setOpen] = useState(false);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (open) {
			setVisible(true);
		} else {
			const timeout = setTimeout(() => setVisible(false), 400); // wait animation end
			return () => clearTimeout(timeout);
		}
	}, [open]);
	// Toggles drawer visibility and optionally triggers parent action
	const handleOpen = () => {
		if (onOpenProfil) onOpenProfil?.();
		setOpen(false);
	};

	// we get the token in the burger to check if the user is connected and swap the  burger optin connect/disconnect
	const { user, logout } = useAuthContext();
	const router = useRouter();

	// disconnect function, we call the backend to clear the cookie and we use the authcontext to refresh it after.
	const handleLogout = async () => {
		await logout(); // clears the cookie via API and resets user context
		localStorage.removeItem("zombieland_reservation"); // optional: clear any local data
		setOpen(false);
		handleOpen();
		router.push("/");
	};

	return (
		<>
			{/* Trigger button (User icon) */}
			<button
				type="button"
				aria-label="Profil"
				onClick={() => setOpen(true)}
				className="rounded-full p-2 text-primary 
                    active:bg-primary/40 hover:text-primary-dark
                   "
			>
				<User className="h-6 w-6" />
			</button>

			{/* Drawer menu - appears over full screen when open */}
			{visible && (
				<div
					className={`fixed inset-0 z-50 flex flex-col bg-bg/95 px-6 py-8 text-xl font-subtitle uppercase backdrop-blur
			${open ? "animate-slide-in-right" : "animate-slide-out-right"}`}
				>
					{/* Close button (top right) */}
					<button
						type="button"
						aria-label="Fermer"
						onClick={() => setOpen(false)}
						className="self-end rounded p-2 text-primary  active:bg-primary/40"
					>
						<X className="h-7 w-7" />
					</button>

					{user ? (
						<ul className="mt-8 flex flex-grow flex-col gap-6 ">
							<li>
								<Link
									href="/mon-profil"
									onClick={handleOpen}
									className="flex gap-3 py-2 text-primary-light transition-colors hover:text-primary"
								>
									Mon profil
								</Link>
							</li>

							<li>
								<Link
									href="/mes-reservations"
									onClick={handleOpen}
									className="flex gap-3 py-2 text-primary-light transition-colors hover:text-primary"
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
										className="flex gap-3 py-2 text-red-500 font-bold transition-colors hover:text-red-700"
									>
										Espace Admin
									</Link>
								</li>
							)}

							<li>
								<button
									type="button"
									onClick={handleLogout}
									className="flex gap-3 py-2 text-primary-light transition-colors hover:text-primary"
								>
									Déconnexion
								</button>
							</li>
						</ul>
					) : (
						<ul className="mt-8 flex flex-grow flex-col gap-6 ">
							<li>
								<Link
									href="/connexion"
									onClick={handleOpen}
									className="flex gap-3 py-2 text-primary-light transition-colors hover:text-primary"
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
