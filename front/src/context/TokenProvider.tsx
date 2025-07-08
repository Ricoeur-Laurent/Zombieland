"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

// Crée le contexte
const TokenContext = createContext<{
	token: string | null;
	setToken: (token: string | null) => void;
	user: {
		id: number;
		firstname: string;
		lastname: string;
		email: string;
		admin: boolean;
	} | null;
}>({
	token: null,
	setToken: () => {},
	user: null,
});

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
	const [token, setToken] = useState<string | null>(null);
	const [user, setUser] = useState<{
		id: number;
		firstname: string;
		lastname: string;
		email: string;
		admin: boolean;
	} | null>(null);

	useEffect(() => {
		const checkToken = async () => {
			const storedToken = localStorage.getItem("token");
			if (!storedToken) {
				setToken(null);
				setUser(null);
				return;
			}

			try {
				const response = await fetch("http://localhost:5000/auth/verify", {
					headers: {
						Authorization: `Bearer ${storedToken}`,
					},
				});

				if (!response.ok) {
					// Token invalide
					console.log("Token invalide ou expiré. Suppression du localStorage.");
					localStorage.removeItem("token");
					setToken(null);
					setUser(null);
					return;
				}

				const data = await response.json();
				console.log("Token valide, utilisateur :", data.user);
				setToken(storedToken);
				setUser(data.user);
			} catch (error) {
				console.error("Erreur lors de la vérification du token :", error);
				localStorage.removeItem("token");
				setToken(null);
				setUser(null);
			}
		};

		checkToken();
	}, []);

	return (
		<TokenContext.Provider value={{ token, setToken, user }}>
			{children}
		</TokenContext.Provider>
	);
};

export const useTokenContext = () => useContext(TokenContext);
