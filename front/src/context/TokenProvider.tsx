"use client";

// When to use use client in NextJs?
// The 'use client' directive declares an entry point for the components to be rendered on the client side and should be used when creating interactive user interfaces (UI) that require client-side JavaScript capabilities, such as state management, event handling, and access to browser APIs.

import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";

// Context type-safe
// we create an empty context that 'll be filled when the api provide it
export const TokenContext = createContext<
	| undefined
	| {
			token: string | null;
			setToken: React.Dispatch<React.SetStateAction<string | null>>;
	  }
>(undefined);

export default function TokenProvider({ children }: { children: ReactNode }) {
	const [token, setToken] = useState<string | null>(null);

	// if there is a token, charge it in the localstorage
	useEffect(() => {
		const storedToken = localStorage.getItem("token");
		if (storedToken) {
			setToken(storedToken);
		}
	}, []);

	// update local storage as soon as the token changes
	useEffect(() => {
		if (token) {
			localStorage.setItem("token", token);
		} else {
			localStorage.removeItem("token");
		}
	}, [token]);

	return (
		<TokenContext.Provider value={{ token, setToken }}>
			{children}
		</TokenContext.Provider>
	);
}

// Hook that we 'll be able to use everywhere in the app
export const useTokenContext = () => {
	const context = useContext(TokenContext);
	if (!context) {
		throw new Error("useTokenContext must be used within a TokenProvider");
	}
	return context;
};
