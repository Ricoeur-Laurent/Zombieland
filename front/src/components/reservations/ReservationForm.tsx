"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTokenContext } from "@/context/TokenProvider";

export default function ReservationForm() {
	const { token } = useTokenContext();
	const router = useRouter();

	const [date, setDate] = useState<string>("");
	const [visitors, setVisitors] = useState<number | undefined>(undefined);
	const [calculatedPrice, setCalculatedPrice] = useState<number>(0);

	const today = new Date().toISOString().split("T")[0];

	useEffect(() => {
		const pricePerVisitor = 66;
		const visitorsNumber = visitors ?? 0;
		const price = visitorsNumber * pricePerVisitor;
		setCalculatedPrice(price);

		const reservationData = {
			date,
			visitors,
			calculatedPrice: price,
		};
		localStorage.setItem(
			"zombieland_reservation",
			JSON.stringify(reservationData),
		);
	}, [visitors, date]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (token) {
			router.push("/paiement");
		} else {
			router.push("/connexion?redirect=/paiement");
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="
				flex flex-col gap-4 w-full max-w-sm mx-auto
				bg-surface bg-opacity-90 backdrop-blur-sm
				p-6 rounded-lg border border-primary shadow-lg
			"
		>
			<label
				htmlFor="visitors"
				className="text-primary-light font-subtitle uppercase tracking-wide text-xl"
			>
				Nombre de visiteur(s)
			</label>
			<input
				id="visitors"
				type="number"
				min={1}
				value={visitors ?? ""}
				onChange={(e) => {
					const v = e.target.value;
					setVisitors(v === "" ? undefined : Number(v));
				}}
				placeholder="Entrez le nombre de visiteurs"
				required
				className="p-2 rounded bg-background border border-primary text-text"
			/>

			<label
				htmlFor="date"
				className="text-primary-light font-subtitle uppercase tracking-wide text-xl"
			>
				Date
			</label>
			<input
				id="date"
				type="date"
				value={date}
				min={today}
				onChange={(e) => setDate(e.target.value)}
				required
				className="p-2 rounded bg-background border border-primary text-text"
			/>

			<p className="text-lg font-semibold text-text">
				Tarif calculé : {calculatedPrice} €
			</p>

			<button
				type="submit"
				className="bg-primary text-background py-2 rounded hover:bg-primary/90 transition"
			>
				Réserver
			</button>
		</form>
	);
}
