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
};

// Create the context with default values
const TokenContext = createContext<TokenContextType>({
	token: null,
	setToken: () => {},
	user: null,
});

export const TokenProvider = ({ children }: { children: React.ReactNode }) => {
	const [token, setTokenState] = useState<string | null>(
		() => Cookies.get("zombieland_token") || null,
	);

	const [user, setUser] = useState<UserType>(null);

	useEffect(() => {
		const checkToken = async () => {
			if (!token) {
				setUser(null);
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
					},
				);

				if (!response.ok) {
					Cookies.remove("token");
					setTokenState(null);
					setUser(null);
					return;
				}

				const data = await response.json();
				setTokenState(token);
				setUser(data.user);
			} catch (error) {
				if (process.env.NODE_ENV === "development") {
					console.error("Erreur lors du check token :", error);
				}
				Cookies.remove("token");
				setTokenState(null);
				setUser(null);
			}
		};

		checkToken();
	}, [token]); // ✅ added token here so if token change the use effect is triggered

	const setToken = (newToken: string | null) => {
		if (newToken) {
			// Store the token in cookies securely
			Cookies.set("zombieland_token", newToken, {
				expires: 1, // 1 day
				secure: process.env.NODE_ENV === "production", // HTTPS only in production
				sameSite: "strict",
			});
			setTokenState(newToken);
		} else {
			// Remove token and clear user on logout
			Cookies.remove("zombieland_token");
			setTokenState(null);
			setUser(null);
		}
	};

	return (
		<TokenContext.Provider value={{ token, setToken, user }}>
			{children}
		</TokenContext.Provider>
	);
};

export const useTokenContext = () => useContext(TokenContext);
