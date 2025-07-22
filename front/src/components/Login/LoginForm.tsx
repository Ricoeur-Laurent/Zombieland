"use client";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { getApiUrl } from "@/utils/getApi";
import Modal from "../modal/Modal";

export default function ConnexionForm() {
	const { refreshUser } = useAuthContext();
	const router = useRouter();
	const searchParams = useSearchParams();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [showPasswordWarning, setShowPasswordWarning] = useState(false);

	const [error, setError] = useState("");
	const redirect = searchParams.get("redirect") || "/";

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError("");

		try {
			const response = await fetch(`${getApiUrl()}/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
				credentials: "include", // important pour le cookie HTTP-only
			});

			if (!response.ok) {
				throw new Error("Invalid credentials or server error");
			}

			const data = await response.json();

			await refreshUser(); // 🔁 recharge the user info's

			if (data.user?.mustChangePassword) {
				setShowPasswordWarning(true);
			} else if (data.user?.admin === true) {
				router.push("/admin");
			} else {
				const redirectPath = searchParams.get("redirect") || "/reservations";
				router.push(redirectPath);
			}
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
		<>
			<form
				onSubmit={handleSubmit}
				className="flex flex-col gap-4 w-full max-w-xl mx-auto bg-surface bg-opacity-90 backdrop-blur-sm p-6 rounded-lg border border-primary shadow-lg"
			>
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
						className="bg-bg text-text border border-muted rounded-lg px-3 py-2 focus:outline-none focus:border-primary placeholder:text-muted font-body text-xl"
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
					Me connecter
				</button>
				<p className="mt-4 text-sm text-center">
					Pas encore de compte ?{" "}
					<Link
						href={`/inscription${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
						className="text-primary hover:underline"
					>
						Créez un compte ici
					</Link>
				</p>
			</form>
			<Modal
				isOpen={showPasswordWarning}
				onClose={() => setShowPasswordWarning(false)}
				title="Mot de passe par défaut"
				confirmText="OK"
				onConfirm={() => {
					setShowPasswordWarning(false);
					router.push("/mon-profil");
				}}
			>
				<p className="text-text font-body">
					Votre mot de passe est toujours <strong>“changeme”</strong>. <br />
					Pensez à le modifier depuis votre profil pour sécuriser votre compte !
				</p>
			</Modal>
		</>
	);
}
