"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTokenContext } from "@/context/TokenProvider";

export default function ReservationForm() {
	const { token } = useTokenContext();
	const router = useRouter();

	const [date, setDate] = useState<string>("");
	// we put undefined here so we can set a place holder in the input later
	const [visitors, setVisitors] = useState<number | undefined>(undefined);
	const [calculatedPrice, setCalculatedPrice] = useState<number>(0);

	const today = new Date().toISOString().split("T")[0];

	useEffect(() => {
		const storedReservation = localStorage.getItem("zombieland_reservation");
		if (token && storedReservation) {
			router.push("/paiement");
		}
	}, [token, router]);

	useEffect(() => {
		if (!date || !visitors || visitors <= 0) {
			return;
		}
		const pricePerVisitor = 66;
		// here we need to check if visitors is not undefined or 0
		const visitorsNumber = visitors ?? 0;
		const price = visitorsNumber * pricePerVisitor;
		setCalculatedPrice(price);

		const reservationData = {
			date,
			visitors,
			calculatedPrice: price,
		};
		// we store the data in the local storage so when the user is later redirected to "paiement" he won't have to do it all over again
		localStorage.setItem(
			"zombieland_reservation",
			JSON.stringify(reservationData),
		);
	}, [visitors, date]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// here we check if the user is connected with his token, if he got one he goes to the paiement page else, he need to connect before being redirected
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
				Nombre de visiteurs
			</label>
			<input
				id="visitors"
				type="number"
				min={1}
				// we set the value so when the page is on visitors is undefenid so we got an empty string and we can use our place holder
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
				className="bg-primary-light text-black font-bold py-2 rounded hover:bg-primary transition border border-primary"
			>
				Valider ma réservation
			</button>
		</form>
	);
}
