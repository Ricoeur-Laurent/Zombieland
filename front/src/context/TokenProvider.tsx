"use client";

import Cookies from "js-cookie";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

// Types for clarity
type UserType = {
	id: number;
	firstname: string;
	lastname: string;
	phone: string;
	email: string;
	admin: boolean;
} | null;

type TokenContextType = {
	token: string | null;
	setToken: (token: string | null) => void;
	user: UserType;
	loading: boolean;
};

// Create the context with default values
const TokenContext = createContext<TokenContextType>({
	token: null,
	setToken: () => {},
	user: null,
	loading: true, // important ici
});

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
	const [token, setTokenState] = useState<string | null>(
		() => Cookies.get("zombieland_token") || null
	);
	const [user, setUser] = useState<UserType>(null);
	const [loading, setLoading] = useState(true); // ✅ charging state

	useEffect(() => {
		const checkToken = async () => {
			if (!token) {
				setUser(null);
				setLoading(false);
				return;
			}

			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
						credentials: "include",
					}
				);

				if (!response.ok) {
					Cookies.remove("zombieland_token");
					setTokenState(null);
					setUser(null);
				} else {
					const data = await response.json();
					setUser(data.user);
				}
			} catch (error) {
				console.error("Erreur lors du check token :", error);
				Cookies.remove("zombieland_token");
				setTokenState(null);
				setUser(null);
			} finally {
				setLoading(false); // ✅ Marque la fin du chargement
			}
		};

		checkToken();
	}, [token]);

	const setToken = (newToken: string | null) => {
		if (newToken) {
			Cookies.set("zombieland_token", newToken, {
				expires: 1,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
			});
			setTokenState(newToken);
		} else {
			Cookies.remove("zombieland_token");
			setTokenState(null);
			setUser(null);
		}
	};

	return (
		<TokenContext.Provider value={{ token, setToken, user, loading }}>
			{children}
		</TokenContext.Provider>
	);
};


export const useTokenContext = () => useContext(TokenContext);
