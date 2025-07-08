"use client";

import ReservationForm from "@/components/reservations/ReservationForm";
import { useTokenContext } from "@/context/TokenProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const metadata = {
	title: "reservation–ZombieLand",
	description: "page to buy a ticket for ZombieLand.",
};

export default function ReservationsPage() {
	const { token } = useTokenContext();
	const router = useRouter();

	return (
		<div className="p-8 min-h-screen flex flex-col items-center justify-center text-text">
			<h2 className="text-center text-3xl sm:text-5xl font-subtitle uppercase text-primary mb-8">
				Réserver votre visite
			</h2>
			<ReservationForm />
		</div>
	);
}
