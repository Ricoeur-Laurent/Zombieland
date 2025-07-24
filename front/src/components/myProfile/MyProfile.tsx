"use client";
import { Edit, Eye } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Modal from "@/components/modal/Modal";
import { useAuthContext } from "@/context/AuthContext";
import { getApiUrl } from "@/utils/getApi";

export default function MyProfile() {
	const { user, logout } = useAuthContext();
	const [loading, setLoading] = useState(true);
	const [redirecting, setRedirecting] = useState(false);

	const router = useRouter();
	const searchParams = useSearchParams();

	// usestate pour modale edit
	const [showEditModal, setShowEditModal] = useState(false);
	const [name, setName] = useState("");
	const [champActif, setChampActif] = useState<
		"firstname" | "lastname" | "email" | "phone"
	>("firstname");

	// usestate pour modal delete
	const [showDeleteModal, setshowDeleteModal] = useState(false);

	// usestate pour modale edit password
	const [showPswdEditModal, setShowPswdEditModal] = useState(false);
	const [oldPswd, setOldPswd] = useState("");
	const [newPswd, setNewPswd] = useState("");
	const [newPswdConfirm, setNewPswdConfirm] = useState("");
	const [showNewPswd, setShowNewPswd] = useState(false);
	const [showOldPswd, setShowOldPswd] = useState(false);
	const [showNewPswdConf, setShowNewPswdConf] = useState(false);

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

	const fieldTitles = {
		firstname: "du prénom",
		lastname: "du nom",
		email: "de l'email",
		phone: "du téléphone",
	};

	// formate phone input from user
	function formatPhone(value: string) {
		const digits = value.replace(/\D/g, "").slice(0, 10);
		return digits.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
	}

	// logout user after account deletion
	const handleLogout = async () => {
		await logout();
		router.push("/");
	};

	const displayProfil = useCallback(async () => {
		// Retrieving data from the user's profile
		try {
			const response = await fetch(`${getApiUrl()}/myProfile/${user?.id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			});
			if (!response.ok) {
				console.error(
					"Erreur lors de la récupération des informations du profil",
				);
				return;
			}
			const data = await response.json();
			setFirstName(data.firstname || "");
			setLastName(data.lastname || "");
			setEmail(data.email || "");
			setPhone(data.phone || "");
		} catch (error) {
			console.error(
				"Erreur lors de la récupération des informations du profil",
				error,
			);
		} finally {
			setLoading(false);
		}
	}, [user?.id]);

	// edit user paswword
	const handlePswdEdit = async () => {
		setErrors({});
		setError("");

		if (oldPswd === "") {
			setError("L'ancien mot de passe est obligatoire");
			return;
		}

		if (newPswd !== newPswdConfirm) {
			setError("Echec lors de la confirmation du nouveau mot de passe");
			return;
		}

		try {
			const response = await fetch(
				`${getApiUrl()}/myProfile/pswd/${user?.id}`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						newPswd: newPswd,
						oldPswd: oldPswd,
					}),
					credentials: "include",
				},
			);
			if (!response.ok) {
				console.error(
					"erreur serveur lors de la mise à jour du mot de passe",
					error,
				);
			}

			setShowPswdEditModal(false);
		} catch (error) {
			console.error("Erreur lors de la mise à jour du mot de passe", error);
		}
	};

	// edit profile in database with user update
	const handleEdit = async () => {
		setErrors({});
		setError("");
		if (!champActif) return;
		if (champActif === "phone") {
			const digits = name.replace(/\D/g, "");
			if (!/^0[1-9]\d{8}$/.test(digits)) {
				setError("Numéro de téléphone invalide.");
				return;
			}
		}

		try {
			const response = await fetch(`${getApiUrl()}/myProfile/${user?.id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},

				body: JSON.stringify({
					[champActif]: name,
				}),
				credentials: "include",
			});
			const data = await response.json();
			// TODO: à améliorer quand l'API renverra un objet `errors`
			if (!response.ok) {
				if (response.status === 400 && Array.isArray(data.errors)) {
					const zodErrors = Object.fromEntries(
						// biome-ignore lint/suspicious/noExplicitAny : cast temporary
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

				setError(
					data.error || "Erreur lors de la modification des données du profil.",
				);
				return;
			}
			if (response.ok) {
				setShowEditModal(false);
				displayProfil();
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

	// delete user from database
	const handleDelete = async () => {
		try {
			const response = await fetch(`${getApiUrl()}/myProfile/${user?.id}`, {
				method: "DELETE",
				headers: {},
				credentials: "include",
			});
			if (!response.ok) {
				const data = await response.json().catch(() => null);
				const message = data?.error || "Échec de la suppression du profil.";
				console.error("Erreur API :", message);
				setError(message);
				return;
			}

			setshowDeleteModal(false);
			handleLogout();
		} catch (e) {
			console.error("Erreur réseau :", e);
			setError(
				e instanceof Error
					? `Erreur serveur : ${e.message}`
					: "Une erreur inconnue est survenue.",
			);
		}
	};
	// Check if the client is logged in, otherwise redirect him on the connexion page
	useEffect(() => {
		if (!user || !user.id) {
			setRedirecting(true);
			const timeout = setTimeout(() => {
				const redirectPath = searchParams.get("redirect") || "/mon-profil";
				router.push(`/connexion?redirect=${redirectPath}`);
			}, 3000);
			return () => clearTimeout(timeout);
		}
	}, [user, router, searchParams]);

	// Retrieve user's data to display it on the page

	useEffect(() => {
		if (user?.id) {
			displayProfil();
		} else {
			setLoading(false);
			setRedirecting(false);
		}
	}, [user, displayProfil]);

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
		<>
			<section className="flex flex-col gap-4 w-full max-w-xl mx-auto bg-surface/70 p-6 rounded-lg border-l-4 border-primary shadow-lg">
				<ul className="space-y-2">
					<div className="flex justify-between items-center mb-1">
						<h2 className="text-xl font-subtitle text-primary-light">Prénom</h2>
					</div>
					<li
						className="bg-bg text-text border rounded-lg px-3 py-2 mb-3 focus:outline-none font-body text xl
						focus:border-primary flex justify-between items-center  border-muted "
					>
						<span>{firstname}</span>
						<div className="flex gap-2">
							<Edit
								onClick={() => {
									setShowEditModal(true);
									setName(firstname);
									setChampActif("firstname");
								}}
								className="size-4 text-primary cursor-pointer"
							/>
						</div>
					</li>
					<div className="flex justify-between items-center mb-1">
						<h2 className="text-xl font-subtitle text-primary-light">Nom</h2>
					</div>
					<li
						className="bg-bg text-text border rounded-lg px-3 py-2 mb-3 focus:outline-none font-body text xl
						focus:border-primary flex justify-between items-center  border-muted "
					>
						<span>{lastname}</span>
						<div className="flex gap-2">
							<Edit
								onClick={() => {
									setShowEditModal(true);
									setName(lastname);
									setChampActif("lastname");
								}}
								className="size-4 text-primary cursor-pointer"
							/>
						</div>
					</li>
					<div className="flex justify-between items-center mb-1">
						<h2 className="text-xl font-subtitle text-primary-light">Email</h2>
					</div>
					<li
						className="bg-bg text-text border rounded-lg px-3 py-2 mb-3 focus:outline-none font-body text xl
						focus:border-primary flex justify-between items-center  border-muted "
					>
						<span>{email}</span>
						<div className="flex gap-2">
							<Edit
								onClick={() => {
									setShowEditModal(true);
									setName(email);
									setChampActif("email");
								}}
								className="size-4 text-primary cursor-pointer"
							/>
						</div>
					</li>
					<div className="flex justify-between items-center mb-1">
						<h2 className="text-xl font-subtitle text-primary-light">
							Téléphone
						</h2>
					</div>
					<li
						className="bg-bg text-text border rounded-lg px-3 py-2 mb-3 focus:outline-none font-body text xl
						focus:border-primary flex justify-between items-center  border-muted "
					>
						<span>{phone}</span>
						<div className="flex gap-2">
							<Edit
								onClick={() => {
									setShowEditModal(true);
									setName(phone);
									setChampActif("phone");
								}}
								className="size-4 text-primary cursor-pointer"
							/>
						</div>
					</li>
				</ul>

				{/* Password modification */}
				<button
					type="button"
					onClick={() => setShowPswdEditModal(true)}
					className="bg-primary text-bg px-6 py-2 rounded-lg font-bold hover:bg-primary-dark"
				>
					Modifier mon mot de passe
				</button>

				{/* Account deletion */}
				<p className="mt-4 text-sm text-center">
					Pour supprimer votre compte,{" "}
					<button
						type="button"
						onClick={() => setshowDeleteModal(true)}
						className="text-primary hover:underline p-0 border-none bg-transparent font-inherit"
					>
						cliquez ici !
					</button>
				</p>
			</section>
			{/* edit profile modale */}
			<Modal
				isOpen={showEditModal}
				onClose={() => {
					setShowEditModal(false);
				}}
				title={`Modification ${fieldTitles[champActif]}`}
				confirmText="Confirmer"
				onConfirm={handleEdit}
			>
				<input
					value={name}
					onChange={(e) => {
						const raw = e.target.value;
						setName(champActif === "phone" ? formatPhone(raw) : raw);
					}}
					inputMode={champActif === "phone" ? "numeric" : undefined}
					className="w-full mb-2 p-2 border rounded"
				/>
				{error && <p className="text-red-500 text-sm font-body">{error}</p>}
			</Modal>
			{/* edit password modale */}
			<Modal
				isOpen={showPswdEditModal}
				onClose={() => {
					setShowPswdEditModal(false);
				}}
				title="Modification du mot de passe"
				confirmText="Confirmer"
				onConfirm={handlePswdEdit}
			>
				<div className="flex gap-2 items-center ">
					<input
						type={showOldPswd ? "text" : "password"}
						className="w-full mb-2 p-2 border rounded"
						placeholder="Ancien mot de passe"
						value={oldPswd}
						onChange={(e) => setOldPswd(e.target.value)}
						required
					/>
					<Eye
						className="mb-2 text-primary"
						onClick={() => {
							setShowOldPswd(!showOldPswd);
						}}
					/>
				</div>
				<div className="flex gap-2 items-center ">
					<input
						type={showNewPswd ? "text" : "password"}
						className="w-full mb-2 p-2 border rounded"
						placeholder="Nouveau mot de passe"
						value={newPswd}
						onChange={(e) => setNewPswd(e.target.value)}
						required
					/>
					<Eye
						className="mb-2 text-primary"
						onClick={() => {
							setShowNewPswd(!showNewPswd);
						}}
					/>
				</div>
				<div className="flex gap-2 items-center ">
					<input
						type={showNewPswdConf ? "text" : "password"}
						className="w-full mb-2 p-2 border rounded"
						placeholder="Confirmation nouveau mot de passe"
						value={newPswdConfirm}
						onChange={(e) => setNewPswdConfirm(e.target.value)}
						required
					/>
					<Eye
						className="mb-2 text-primary"
						onClick={() => {
							setShowNewPswdConf(!showNewPswdConf);
						}}
					/>
				</div>
				{error && <p className="text-red-500 text-sm font-body">{error}</p>}
			</Modal>
			{/* delete modal */}
			<Modal
				isOpen={showDeleteModal}
				onClose={() => {
					setshowDeleteModal(false);
				}}
				title="Confirmer la suppression du compte"
				confirmText="Confirmer la suppression"
				onConfirm={handleDelete}
			>
				<p className="text-text font-body">
					Êtes-vous certain de vouloir supprimer votre compte ? Toute
					suppression sera définitive.
				</p>
			</Modal>
		</>
	);
}
