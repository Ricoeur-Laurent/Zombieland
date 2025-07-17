"use client"
import { useTokenContext } from "@/context/TokenProvider";
import { getApiUrl } from "@/utils/getApi";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import Modal from "@/components/modal/Modal";
import Cookies from "js-cookie";


export default function MyProfil() {
    const { user, token, setToken } = useTokenContext();
    const [loading, setLoading] = useState(true);
    const [redirecting, setRedirecting] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    // usestate pour modale edit
    const [showEditModal, setShowEditModal] = useState(false);
    const [name, setName] = useState("")
    const [champActif, setChampActif] = useState<"firstname" | "lastname" | "email" | "phone" | null>(null);

    // usestate pour modal delete
    const [showDeleteModal, setshowDeleteModal] = useState(false)

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

    // formate phone input from user
    function formatPhone(value: string) {
        const digits = value.replace(/\D/g, "").slice(0, 10);
        return digits.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
    }

    // logout user after account deletion
    const handleLogout = () => {
        // Remove the token from the cookies
        Cookies.remove("zombieland_token");

        // Clear the token from the context
        setToken(null);

        // Redirect the user to the home page after logout
        router.push("/");
    };

    const displayProfil = async () => {
        // Retrieving data from the user's profile
        try {
            const response = await fetch(
                `${getApiUrl()}/myProfil/${user?.id}`,
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

    // edit profile in database after user update
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
            const response = await fetch(
                `${getApiUrl()}/myProfil/${user?.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        [champActif]: name,
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

                setShowEditModal(false)
                displayProfil()
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
            const response = await fetch(`${getApiUrl()}/myProfil/${user?.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    credentials: "include",
                },
            );
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
                    ? "Erreur serveur : " + e.message
                    : "Une erreur inconnue est survenue."
            );
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
        <>
            <section className="mb-10">
                <ul className="space-y-2">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-xl font-subtitle text-primary-light">
                            Prénom
                        </h2>
                    </div>
                    <li className="flex justify-between items-center px-4 py-2 bg-surface border border-muted rounded">
                        <span>{firstname}</span>
                        <div className="flex gap-2">
                            <Edit
                                onClick={() => {
                                    setShowEditModal(true);
                                    setName(firstname);
                                    setChampActif("firstname")
                                }}
                                className="size-4 text-primary cursor-pointer"
                            />
                        </div>
                    </li>
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-xl font-subtitle text-primary-light">
                            Nom
                        </h2>
                    </div>
                    <li className="flex justify-between items-center px-4 py-2 bg-surface border border-muted rounded">

                        <span>{lastname}</span>
                        <div className="flex gap-2">
                            <Edit
                                onClick={() => {
                                    setShowEditModal(true);
                                    setName(lastname);
                                    setChampActif("lastname")
                                }}
                                className="size-4 text-primary cursor-pointer"
                            />
                        </div>
                    </li>
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-xl font-subtitle text-primary-light">
                            Email
                        </h2>
                    </div>
                    <li className="flex justify-between items-center px-4 py-2 bg-surface border border-muted rounded">
                        <span>{email}</span>
                        <div className="flex gap-2">
                            <Edit
                                onClick={() => {
                                    setShowEditModal(true);
                                    setName(email);
                                    setChampActif("email")
                                }}
                                className="size-4 text-primary cursor-pointer"
                            />
                        </div>
                    </li>
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-xl font-subtitle text-primary-light">
                            Téléphone
                        </h2>
                    </div>
                    <li className="flex justify-between items-center px-4 py-2 bg-surface border border-muted rounded">
                        <span>{phone}</span>
                        <div className="flex gap-2">
                            <Edit
                                onClick={() => {
                                    setShowEditModal(true);
                                    setName(phone);
                                    setChampActif("phone")
                                }}
                                className="size-4 text-primary cursor-pointer"
                            />
                        </div>
                    </li>
                </ul>
            </section>
            <div className="text-center mt-6">
                <button
                    type="button"
                    // onClick={onClick}
                    className="bg-primary text-bg px-6 py-2 rounded-lg font-bold hover:bg-primary-dark"
                >
                    Modifier mon mot de passe
                </button>
            </div>		<div className="text-center mt-6">
                <button
                    type="button"
                    onClick={() =>
                        setshowDeleteModal(true)
                    }
                    className="bg-primary text-bg px-6 py-2 rounded-lg font-bold hover:bg-primary-dark"
                >
                    {error && <p className="text-red-500 text-sm font-body">{error}</p>}

                    Supprimer mon compte
                </button>
            </div>
            {/* edit modale */}
            <Modal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                }}
                title="Champs à modifier"
                confirmText="Confirmer"
                onConfirm={handleEdit}
            >
                <input
                    value={name}
                    onChange={(e) => {
                        const raw = e.target.value;
                        setName(
                            champActif === "phone" ? formatPhone(raw) : raw
                        );
                    }}
                    inputMode={champActif === "phone" ? "numeric" : undefined}
                    className="w-full mb-2 p-2 border rounded"
                />

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
                    suppression sera définitive.</p>
            </Modal>
        </>
    )
}
