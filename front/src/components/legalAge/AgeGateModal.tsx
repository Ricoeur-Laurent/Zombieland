"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AgeGateModal() {
	const [show, setShow] = useState(false);
	const router = useRouter();
	useEffect(() => {
		const consent = sessionStorage.getItem("zombieland_age_confirmed");
		if (!consent) {
			setShow(true);
		}
	}, []);

	const handleConfirm = () => {
		sessionStorage.setItem("zombieland_age_confirmed", "true");
		setShow(false);
	};

	const handleReject = () => {
		router.push("https://www.google.fr");
	};

	if (!show) return null;

	return (
		<div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center px-4">
			<div className="bg-bg p-6 rounded-xl text-white max-w-md w-full text-center border border-primary shadow-xl">
				<h2 className="text-2xl font-bold mb-4">Âge requis</h2>
				<p className="mb-6">
					Ce site contient du contenu susceptible de choquer les moins de 16
					ans. Veuillez confirmer que vous avez l'âge requis pour entrer dans
					ZombieLand.
				</p>
				<div className="flex justify-center gap-4">
					<button
						type="button"
						onClick={handleConfirm}
						className="bg-primary hover:bg-primary/90 transition px-6 py-3 rounded font-semibold"
					>
						Oui, j’ai l’âge requis
					</button>
					<button
						type="button"
						onClick={handleReject}
						className="bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded font-semibold"
					>
						Non
					</button>
				</div>
			</div>
		</div>
	);
}
