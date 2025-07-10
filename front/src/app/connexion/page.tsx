import ConnexionForm from "@/components/Login/LoginForm";

export const metadata = {
	title: "Connexion – Zombieland",
	description:
		"Connectez-vous à Zombieland pour accéder à vos réservations et profiter de nos attractions.",
};

export default function ConnexionPage() {
	return (
		<div className="flex flex-col items-center justify-start min-h-screen px-4 py-12">
			<h2 className="text-center text-3xl sm:text-5xl font-subtitle uppercase text-primary mb-8">
				Connexion
			</h2>
			<ConnexionForm />
		</div>
	);
}
