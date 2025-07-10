"use client";
import { LogIn } from "lucide-react";

import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";
import { useTokenContext } from "@/context/TokenProvider";

export default function RegistrationForm() {
	const { setToken } = useTokenContext();
	const router = useRouter();
	const searchParams = useSearchParams();

	const [firstname, setFirstName] = useState("");
	const [lastname, setLastName] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("votre@email.com");
	const [password, setPassword] = useState("password");
	const [error, setError] = useState("");

	function formatPhone(value: string) {
		const digits = value.replace(/\D/g, "").slice(0, 10);
		return digits.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError("");

		const rawPhone = phone.replace(/\D/g, "");
		if (!/^0[1-9]\d{8}$/.test(rawPhone)) {
			setError("Numéro de téléphone invalide.");
			return;
		}

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/signUp`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						firstname,
						lastname,
						email,
						password,
						phone: phone.replace(/\D/g, ""),
					}),
					credentials: "include",
				},
			);

			if (!response.ok) {
				throw new Error("Invalid credentials or server error");
			}

			const data = await response.json();

			setToken(data.token);

			const redirectPath = searchParams.get("redirect") || "/reservations";
			router.push(redirectPath);
		} catch (e) {
			if (e instanceof Error) {
				console.error(e);
				setError("Identifiants invalides ou erreur serveur.");
			} else {
				console.error("Unknown error", e);
				setError("Erreur inconnue.");
			}
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-4 w-full max-w-xl mx-auto bg-surface bg-opacity-90 backdrop-blur-sm p-6 rounded-lg border border-primary shadow-lg"
		>
			<div className="flex flex-col gap-1">
				<label
					htmlFor="firstName"
					className="text-primary-light font-subtitle uppercase tracking-wide text-xl"
				>
					Prénom
				</label>
				<input
					id="firstName"
					name="firstName"
					type="text"
					placeholder="votre prénom"
					value={firstname}
					onChange={(e) => setFirstName(e.target.value)}
					required
					className="bg-bg text-text border border-muted rounded-lg px-3 py-2 focus:outline-none focus:border-primary placeholder:text-muted font-body text xl"
				/>
			</div>
			<div className="flex flex-col gap-1">
				<label
					htmlFor="lastName"
					className="text-primary-light font-subtitle uppercase tracking-wide text-xl"
				>
					Nom
				</label>
				<input
					id="lastName"
					name="lastName"
					type="text"
					placeholder="votre nom"
					value={lastname}
					onChange={(e) => setLastName(e.target.value)}
					required
					className="bg-bg text-text border border-muted rounded-lg px-3 py-2 focus:outline-none focus:border-primary placeholder:text-muted font-body text xl"
				/>
			</div>
			<div className="flex flex-col gap-1">
				<label
					htmlFor="email"
					className="text-primary-light font-subtitle uppercase tracking-wide text-xl"
				>
					Email
				</label>
				<input
					id="email"
					name="email"
					type="email"
					placeholder="votre@email.com"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					className="bg-bg text-text border border-muted rounded-lg px-3 py-2 focus:outline-none focus:border-primary placeholder:text-muted font-body text xl"
				/>
			</div>
			<div className="flex flex-col gap-1">
				<label
					htmlFor="phone"
					className="text-primary-light font-subtitle uppercase tracking-wide text-xl"
				>
					Téléphone
				</label>
				<input
					id="phone"
					name="phone"
					type="tel"
					placeholder="votre téléphone"
					value={phone}
					onChange={(e) => setPhone(formatPhone(e.target.value))}
					required
					className="bg-bg text-text border border-muted rounded-lg px-3 py-2 focus:outline-none focus:border-primary placeholder:text-muted font-body text xl"
				/>
			</div>

			<div className="flex flex-col gap-1">
				<label
					htmlFor="password"
					className="text-primary-light font-subtitle uppercase tracking-wide text-xl"
				>
					Mot de passe
				</label>
				<input
					id="password"
					name="password"
					type="password"
					placeholder="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					className="bg-bg text-text border border-muted rounded-lg px-3 py-2 focus:outline-none focus:border-primary placeholder:text-muted font-body text-xl"
				/>
			</div>

			{error && <p className="text-red-500 text-sm font-body">{error}</p>}

			<button
				type="submit"
				className="bg-primary text-black font-subtitle uppercase tracking-wide py-2 rounded-lg hover:bg-primary-dark transition flex items-center justify-center gap-2"
			>
				<LogIn size={18} />
				M'inscrire
			</button>
		</form>
	);
}
