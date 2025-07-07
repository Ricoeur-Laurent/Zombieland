
import ConnexionForm from "@/components/connexion/LoginForm";

export const metadata = {
	title: "connexion ZombieLand",
	description:
		"page to connect to ZombieLand.",
};

export default function ConnexionPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <ConnexionForm />
    </div>
  );
}
