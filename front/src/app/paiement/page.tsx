import PaiementSection from "@/components/paiement/PaiementSection";


export const metadata = {
  title: "Paiement – Zombieland",
  description: "Validez votre paiement pour Zombieland et confirmez votre réservation.",
};

export default function PaiementPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 py-12 bg-background text-text">
      <PaiementSection />
    </div>
  );
}
