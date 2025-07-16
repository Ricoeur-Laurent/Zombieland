"use client"
import { useTokenContext } from "@/context/TokenProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";


export default function MyProfil() {
	const { token, user } = useTokenContext();
	const [loading, setLoading] = useState(true);
	const [redirecting, setRedirecting] = useState(false);
	const [successMessage, setSuccessMessage] = useState("")
	const router = useRouter();
	const searchParams = useSearchParams();

	const [firstname, setFirstName] = useState("");
	const [lastname, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [errors, setErrors] = useState<{
		email?: string;
		phone?: string;
		firstname?: string;
		lastname?: string;
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
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/myProfil/${user?.id}`,
				{
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						firstname,
						lastname,
						email,
						phone: phone.replace(/\D/g, ""),
					}),
					credentials: "include",
				},
			);
			const data = await response.json();
			// TODO: à améliorer quand l'API renverra un objet `errors`
			if (!response.ok) {
				if (response.status === 400 && Array.isArray(data.errors)) {
					const zodErrors = Object.fromEntries(
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

				setError(data.error || "Erreur lors de la modification des données du profil.");
				return;
			}
			if (response.ok) {
				setSuccessMessage("Modifications effectuées avec succès")
			}
			// setToken(data.token);

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

	// Check if the client is logged in, otherwise redirect him on the connexion page
	useEffect(() => {
		if (!token || !user || !user.id) {
			setRedirecting(true);
			const timeout = setTimeout(() => {
				const redirectPath =
					searchParams.get("redirect") || "/mon-profil";
				router.push(`/connexion?redirect=${redirectPath}`);
			}, 3000);
			return () => clearTimeout(timeout);
		} 

	}, [token, user, router, searchParams]);


	// Retrieve user's data to display it on the page
	useEffect(() => {
		const displayProfil = async () => {
			// Retrieving data from the user's profile
			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/myProfil/${user?.id}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						credentials: "include",
					},
				);
				if (!response.ok) {
					console.error("Erreur lors de la récupération des informations du profil");
					return;
				}
				const data = await response.json();
				setFirstName(data.firstname || "");
				setLastName(data.lastname || "");
				setEmail(data.email || "");
				setPhone(data.phone || "");

			} catch (error) {
				console.error("Erreur lors de la récupération des informations du profil", error);
			} finally {
				setLoading(false);
			}
		};
		if (token && user && user.id) {
			displayProfil();
		} else {
			setLoading(false);
			setRedirecting(false)
		}
	}, [token, user]);

	if (redirecting) {
		return (
			<p className="text-center text-primary mt-6">
				Vous devez être connecté pour avoir accès à votre profil,
				<br />
				vous allez être redirigé vers la page de connexion...
			</p>
		);
	}

	if (loading) {
		return (
			<p className="text-center text-primary mt-6">
				Chargement des informations du profil...
			</p>
		);
	}

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
					value={firstname}
					onChange={(e) => setFirstName(e.target.value)}
					
					className={`bg-bg text-text border rounded-lg px-3 py-2 focus:outline-none font-body text xl
			
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
					value={lastname}
					onChange={(e) => setLastName(e.target.value)}
					
					className={`bg-bg text-text border rounded-lg px-3 py-2 focus:outline-none font-body text xl
						
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
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					
					className={`bg-bg text-text border rounded-lg px-3 py-2 focus:outline-none font-body text xl
						
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
					value={phone}
					onChange={(e) => setPhone(formatPhone(e.target.value))}
					
					className={`bg-bg text-text border rounded-lg px-3 py-2 focus:outline-none font-body text xl
						
						focus:border-primary placeholder:text-muted`}
				/>
				{errors.phone && (
					<p className="text-red-500 text-sm font-body">{errors.phone}</p>
				)}
			</div>

			{error && <p className="text-red-500 text-sm font-body">{error}</p>}
			{/* todo a styliser */}
			{successMessage && <p className="text-primary text-md text-center prose prose-invert font-body">{successMessage}</p>}

			<button
				type="submit"
				className="bg-primary text-black font-subtitle uppercase tracking-wide py-2 rounded-lg hover:bg-primary-dark transition flex items-center justify-center gap-2"
			>
				{/* <LogIn size={18} /> */}
				Modifier
				{ }
			</button>
		</form>
	)
}