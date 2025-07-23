"use client"
import { useTokenContext } from "@/context/TokenProvider";
import { getApiUrl } from "@/utils/getApi";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import Modal from "@/components/modal/Modal";
import Cookies from "js-cookie";


export default function MyProfile() {
    const { user, token, setToken } = useTokenContext();
    const [loading, setLoading] = useState(true);
    const [redirecting, setRedirecting] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    // usestate pour modale edit
    const [showEditModal, setShowEditModal] = useState(false);
    const [name, setName] = useState("")
    const [champActif, setChampActif] = useState<"firstname" | "lastname" | "email" | "phone" | "password">("firstname");

    // usestate pour modal delete
    const [showDeleteModal, setshowDeleteModal] = useState(false)

    // usestate pour modale edit password
    const [showPswdEditModal, setShowPswdEditModal] = useState(false)
    const [oldPswd, setOldPswd] = useState("")
    const [newPswd, setNewPswd] = useState("")
    const [newPswdConfirm, setNewPswdConfirm] = useState("")
    const [showNewPswd, setShowNewPswd] = useState(false)
    const [showOldPswd, setShowOldPswd] = useState(false)
    const [showNewPswdConf, setShowNewPswdConf] = useState(false)

    const [firstname, setFirstName] = useState("");
    const [lastname, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState<{
        email?: string;
        phone?: string;
        firstname?: string;
        lastname?: string;
        password?: string;
        general?: string;
    }>({});

    const fieldTitles = {
        firstname: "du prénom",
        lastname: "du nom",
        email: "de l'email",
        phone: "du téléphone",
        password: "du mot de passe"
    };

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
                `${getApiUrl()}/myProfile/${user?.id}`,
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

    // edit user paswword
    const handlePswdEdit = async () => {
        setErrors({});


        if (oldPswd === "") {
            setErrors({ password: "L'ancien mot de passe est obligatoire" })
            return
        }

        if (newPswd !== newPswdConfirm) {
            setErrors({ password: "Echec lors de la confirmation du nouveau mot de passe" })
            return
        }

        try {
            const response = await fetch(
                `${getApiUrl()}/myProfile/pswd/${user?.id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        newPswd: newPswd,
                        oldPswd: oldPswd,
                    }),
                    credentials: "include",
                }
            )
            if (!response.ok) {
                console.error("erreur serveur lors de la mise à jour du mot de passe", errors.password)
            }

            setShowPswdEditModal(false)

        } catch (error) {
            console.error("Erreur lors de la mise à jour du mot de passe", error);
        }
    }

    // edit profile in database with user update
    const handleEdit = async () => {
        setErrors({});
        if (!champActif) return;

        if (champActif === "phone") {
            const digits = name.replace(/\D/g, "");
            if (!/^0[1-9]\d{8}$/.test(digits)) {
                setErrors({ phone: "Numéro de téléphone invalide." });
                return;
            }
        }

        try {
            const response = await fetch(`${getApiUrl()}/myProfile/${user?.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ [champActif]: name }),
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 400 && Array.isArray(data.errors)) {
                    const zodErrors = Object.fromEntries(
                        data.errors.map((err: any) => [err.path[0], err.message])
                    );
                    setErrors(zodErrors);
                    return;
                }

                if (response.status === 409 && typeof data.error === "string") {
                    setErrors({ [champActif]: data.error });
                    return;
                }

                setErrors({ general: data.error || "Erreur lors de la modification." });
                return;
            }

            setShowEditModal(false);
            displayProfil();

        } catch (e) {
            setErrors({ general: "Erreur réseau ou serveur." });
            console.error(e);
        }
    };

    // delete user from database
    const handleDelete = async () => {

        try {
            const response = await fetch(`${getApiUrl()}/myProfile/${user?.id}`,
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
                setErrors({ general: data.error || "Échec de la suppression du compte." });
                return;
            }

            setshowDeleteModal(false);
            handleLogout();
        } catch (e) {
            setErrors({ general: "Erreur réseau ou serveur." });
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
            <section className="flex flex-col gap-4 w-full max-w-md mx-auto bg-surface bg-opacity-90 backdrop-blur-sm p-6 rounded-lg border border-primary shadow-lg">
                <ul className="space-y-2">
                    <div className="flex justify-between items-center mb-1">
                        <h2 className="text-xl font-subtitle text-primary-light">
                            Prénom
                        </h2>
                    </div>
                    <li className="bg-bg text-text border rounded-lg px-3 py-2 mb-3 focus:outline-none font-body text xl
						focus:border-primary flex justify-between items-center  border-muted ">
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
                    <div className="flex justify-between items-center mb-1">
                        <h2 className="text-xl font-subtitle text-primary-light">
                            Nom
                        </h2>
                    </div>
                    <li className="bg-bg text-text border rounded-lg px-3 py-2 mb-3 focus:outline-none font-body text xl
						focus:border-primary flex justify-between items-center  border-muted ">

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
                    <div className="flex justify-between items-center mb-1">
                        <h2 className="text-xl font-subtitle text-primary-light">
                            Email
                        </h2>
                    </div>
                    <li className="bg-bg text-text border rounded-lg px-3 py-2 mb-3 focus:outline-none font-body text xl
						focus:border-primary flex justify-between items-center  border-muted ">
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
                    <div className="flex justify-between items-center mb-1">
                        <h2 className="text-xl font-subtitle text-primary-light">
                            Téléphone
                        </h2>
                    </div>
                    <li className="bg-bg text-text border rounded-lg px-3 py-2 mb-3 focus:outline-none font-body text xl
						focus:border-primary flex justify-between items-center  border-muted ">
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
                    <div className="flex justify-between items-center mb-1">
                        <h2 className="text-xl font-subtitle text-primary-light">
                            Mot de Passe
                        </h2>
                    </div>
                    <li className="bg-bg text-text border rounded-lg px-3 py-2 mb-3 focus:outline-none font-body text xl
						focus:border-primary flex justify-between items-center  border-muted ">
                        <span>**********</span>
                        <div className="flex gap-2">
                            <Edit
                                onClick={() => {
                                    setShowPswdEditModal(true)
                                    setName(password);
                                    setChampActif("password")
                                }}
                                className="size-4 text-primary cursor-pointer"
                            />
                        </div>
                    </li>
                </ul>
                {/* Account deletion */}
                <p className="mt-4 text-sm text-center">
                    Pour supprimer votre compte, {" "}
                    <a href=""
                        onClick={(e) => {
                            e.preventDefault()
                            setshowDeleteModal(true)
                        }}
                        className="text-primary hover:underline">

                        cliquez ici !
                    </a>
                </p>
            </section>
            {/* edit profile modale */}
            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
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
                    className="w-full mb-1 p-2 border rounded"
                />

                {/* Erreur liée au champ actif (ex: email ou phone) */}
                {errors[champActif] && (
                    <p className="text-red-500 text-sm font-body">{errors[champActif]}</p>
                )}

                {/* Erreur générale éventuelle */}
                {errors.general && (
                    <p className="text-red-500 text-sm font-body mt-1">{errors.general}</p>
                )}
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
                <div className="flex gap-2 items-center mb-2 border rounded">
                    <input
                        type={showOldPswd ? "text" : "password"}
                        className="w-full p-2 focus:outline-none focus:ring-0 focus:border-none"
                        placeholder="Ancien mot de passe"
                        value={oldPswd}
                        onChange={(e) => setOldPswd(e.target.value)}
                        required
                    />
                    <Eye
                        className="text-primary mr-2"
                        onClick={() => { setShowOldPswd(!showOldPswd) }} />
                </div>
                <div className="flex gap-2 items-center mb-2 border rounded">

                    <input
                        type={showNewPswd ? "text" : "password"}
                        className="w-full p-2 focus:outline-none focus:ring-0 focus:border-none"
                        placeholder="Nouveau mot de passe"
                        value={newPswd}
                        onChange={(e) => setNewPswd(e.target.value)}
                        required
                    />
                    <Eye
                        className="text-primary mr-2"
                        onClick={() => { setShowNewPswd(!showNewPswd) }} />
                </div>
                <div className="flex gap-2 items-center mb-2 border rounded">
                    <input
                        type={showNewPswdConf ? "text" : "password"}
                        className="w-full p-2 focus:outline-none focus:ring-0 focus:border-none"
                        placeholder="Confirmation nouveau mot de passe"
                        value={newPswdConfirm}
                        onChange={(e) => setNewPswdConfirm(e.target.value)}
                        required
                    />
                    <Eye
                        className="text-primary mr-2"
                        onClick={() => { setShowNewPswdConf(!showNewPswdConf) }} />
                </div>
                {errors.password && <p className="text-red-500 text-sm font-body">{errors.password}</p>}
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
                {errors.general && (
                    <p className="text-red-500 text-sm font-body mt-1">{errors.general}</p>
                )}

            </Modal>
        </>
    )
}
