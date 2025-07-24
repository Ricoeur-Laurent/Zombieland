import ConnexionForm from "@/components/Login/LoginForm";
import { Suspense } from "react";

export const metadata = {
	title: "Connexion – Zombieland",
	description:
		"Connectez-vous à Zombieland pour accéder à vos réservations et profiter de nos attractions.",
};

export default function ConnexionPage() {
	return (
		<div className="px-4 sm:px-6 md:px-8 py-10 max-w-6xl mx-auto">
			<h2 className="text-center text-3xl sm:text-5xl font-subtitle uppercase text-primary mb-8">
				Connexion
			</h2>
			<Suspense  fallback={<div>Chargement...</div>}>
				<ConnexionForm />
			</Suspense>
		</div>
	);
}
