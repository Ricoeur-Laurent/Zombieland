import PaiementSection from "@/components/paiement/PaiementSection";

export const metadata = {
	title: "Paiement – Zombieland",
	description:
		"Validez votre paiement pour Zombieland et confirmez votre réservation.",
};

export default function PaiementPage() {
	return (
		<div className="px-4 py-6 max-w-6xl mx-auto">
			<PaiementSection />
		</div>
	);
}
