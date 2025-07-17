"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CancelPage() {
	const router = useRouter();

	useEffect(() => {
		const timer = setTimeout(() => {
			router.push("/reservations");
		}, 4000);

		return () => clearTimeout(timer);
	}, [router]);

	return (
		<div className="max-w-4xl mx-auto px-4 py-12">
			<h2 className="text-center text-3xl sm:text-5xl font-subtitle uppercase text-primary mb-8">
				paiement annulé
			</h2>
			<p className="mt-2">Vous allez être redirigé vers réservations...</p>
			<p>
				Ou{" "}
				<a href="/reservations" className="text-primary hover:underline">
					cliquez ici
				</a>{" "}
				pour y aller maintenant.
			</p>
		</div>
	);
}
