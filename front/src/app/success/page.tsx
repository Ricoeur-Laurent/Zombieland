"use client";
import { PartyPopper } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SuccessPage() {
	const router = useRouter();

	useEffect(() => {
		const timer = setTimeout(() => {
			router.push("/mes-reservations");
		}, 4000);
		return () => clearTimeout(timer);
	}, [router]);
	useEffect(() => {
		localStorage.removeItem("zombieland_reservation");
	}, []);

	return (
		<div className="max-w-4xl mx-auto px-4 py-12 text-center">
			<PartyPopper className="mx-auto text-green-600 mb-4" size={48} />
			<h2 className="text-3xl sm:text-5xl font-subtitle uppercase text-primary-light mb-4">
				Paiement confirmé
			</h2>
			<p className="mt-2">Vous allez être redirigé vers vos réservations...</p>
			<p className="mt-4 text-sm text-muted">
				Ou{" "}
				<a href="/mes-reservations" className="text-primary hover:underline">
					cliquez ici
				</a>{" "}
				pour y aller maintenant.
			</p>
		</div>
	);
}
