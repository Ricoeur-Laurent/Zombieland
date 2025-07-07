import ConnexionForm from "@/components/connexion/LoginForm";

export const metadata = {
	title: "connexion ZombieLand",
	description: "page to connect to ZombieLand.",
};

export default function ConnexionPage() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-4">
			<h2 className="text-center text-3xl sm:text-5xl font-subtitle uppercase text-primary mb-8">
				Connexion
			</h2>
			<ConnexionForm />
		</div>
	);
}
