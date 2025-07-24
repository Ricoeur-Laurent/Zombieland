import RegistrationForm from "@/components/registration/registrationForm";
import { Suspense } from "react";

export const metadata = {
	title: "Inscription – Zombieland",
	description:
		"Inscrivez-vous à Zombieland pour pouvoir vous connecter accéder à vos réservations et profiter de nos attractions.",
};

export default function ConnexionPage() {
	return (
		<div className="px-4 sm:px-6 md:px-8 py-10 max-w-6xl mx-auto">
			<h2 className="text-center text-3xl sm:text-5xl font-subtitle uppercase text-primary mb-8">
				Inscription
			</h2>
			<Suspense  fallback={<p className="text-center mt-6">Chargement...</p>}>
				<RegistrationForm />
			</Suspense>
		</div>
	);
}
