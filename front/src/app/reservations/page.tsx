"use client";

import ReservationForm from "@/components/reservations/ReservationForm";
import { useTokenContext } from "@/context/TokenProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";



export default function ReservationsPage() {
  const { token } = useTokenContext();
  const router = useRouter();

  return (
    <div className="p-8 min-h-screen flex flex-col items-center justify-center text-text">
      <h1 className="text-3xl font-title text-primary mb-6">Réserver votre visite</h1>
      <ReservationForm />
    </div>
  );
}
