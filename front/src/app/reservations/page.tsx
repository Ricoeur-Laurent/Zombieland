"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTokenContext } from "@/context/ TokenProvider";



export default function ReservationPage() {
  const { token } = useTokenContext();
  const router = useRouter();
// need to put it where the payments submit 'll be done, need to change reservations to paiement
  useEffect(() => {
    if (!token) {
      router.push("/connexion?redirect=/paiement");
    }
  }, [token, router]);

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen text-text">
        Redirection vers la page de connexion...
      </div>
    );
  }

  return (
    <div className="p-8 text-text">
      <h2 className="text-3xl font-subtitle text-primary-light mb-4">
        Réservation
      </h2>
      <p>Contenu de la page de réservation ici (formulaire, sélection de créneaux, etc).</p>
    </div>
  );
}
