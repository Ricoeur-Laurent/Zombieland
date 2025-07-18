"use client";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";
import { useTokenContext } from "@/context/TokenProvider";
import { getApiUrl } from "@/utils/getApi";

export default function RegistrationForm() {
	const { setToken } = useTokenContext();
	const router = useRouter();
	const searchParams = useSearchParams();

	const [firstname, setFirstName] = useState("");
	const [lastname, setLastName] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<{
		email?: string;
		phone?: string;
		firstname?: string;
		lastname?: string;
		password?: string;
	}>({});
	const [error, setError] = useState("");

	function formatPhone(value: string) {
		const digits = value.replace(/\D/g, "").slice(0, 10);
		return digits.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setErrors({});
		setError("");

		const rawPhone = phone.replace(/\D/g, "");
		if (!/^0[1-9]\d{8}$/.test(rawPhone)) {
			setError("Numéro de téléphone invalide.");
			return;
		}

		try {
			const response = await fetch(`${getApiUrl()}/signUp`, {
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
			});

			const data = await response.json();

			if (!response.ok) {
				if (response.status === 400 && Array.isArray(data.errors)) {
					const zodErrors = Object.fromEntries(
						// biome-ignore lint: explicit any
						data.errors.map((err: any) => [err.path[0], err.message]),
					);
					setErrors(zodErrors);
					return;
				}

				if (response.status === 409 && typeof data.error === "string") {
					if (data.error.toLowerCase().includes("email")) {
						setErrors({ email: data.error });
					} else if (data.error.toLowerCase().includes("téléphone")) {
						setErrors({ phone: data.error });
					} else {
						setError(data.error);
					}
					return;
				}

				setError(data.error || "Erreur lors de l'inscription.");
				return;
			}

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
					className={`bg-bg text-text border rounded-lg px-3 py-2 focus:outline-none font-body text xl
						${errors.firstname ? "border-red-500 border-2" : "border-muted"} 
						focus:border-primary placeholder:text-muted`}
				/>
				{errors.firstname && (
					<p className="text-red-500 text-sm font-body">{errors.firstname}</p>
				)}
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
					className={`bg-bg text-text border rounded-lg px-3 py-2 focus:outline-none font-body text xl
						${errors.lastname ? "border-red-500 border-2" : "border-muted"} 
						focus:border-primary placeholder:text-muted`}
				/>
				{errors.lastname && (
					<p className="text-red-500 text-sm font-body">{errors.lastname}</p>
				)}
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
					className={`bg-bg text-text border rounded-lg px-3 py-2 focus:outline-none font-body text xl
						${errors.email ? "border-red-500 border-2" : "border-muted"} 
						focus:border-primary placeholder:text-muted`}
				/>
				{errors.email && (
					<p className="text-red-500 text-sm font-body">{errors.email}</p>
				)}
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
					className={`bg-bg text-text border rounded-lg px-3 py-2 focus:outline-none font-body text xl
						${errors.phone ? "border-red-500 border-2" : "border-muted"} 
						focus:border-primary placeholder:text-muted`}
				/>
				{errors.phone && (
					<p className="text-red-500 text-sm font-body">{errors.phone}</p>
				)}
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
					className={`bg-bg text-text border rounded-lg px-3 py-2 focus:outline-none font-body text xl
						${errors.password ? "border-red-500 border-2" : "border-muted"} 
						focus:border-primary placeholder:text-muted`}
				/>
				{errors.password && (
					<p className="text-red-500 text-sm font-body">{errors.password}</p>
				)}
			</div>

			<div className="flex items-start gap-2 mt-4">
				<input
					type="checkbox"
					id="acceptPrivacy"
					name="acceptPrivacy"
					required
					className="mt-1 accent-primary w-5 h-5"
				/>
				<label
					htmlFor="acceptPrivacy"
					className="text-primary-light font-subtitle uppercase tracking-wide text-xl"
				>
					J'accepte la{" "}
					<Link
						href="/mentions-legales#confidentialite"
						target="_blank"
						rel="noopener"
						className="underline hover:text-primary-dark transition"
					>
						politique de confidentialité
					</Link>
				</label>
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
