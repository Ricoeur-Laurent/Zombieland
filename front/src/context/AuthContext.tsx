// Fichier : AuthContext.tsx

import type React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

type UserType = {
	id: number;
	firstname: string;
	lastname: string;
	phone: string;
	email: string;
	admin: boolean;
} | null;

type AuthContextType = {
	user: UserType;
	loading: boolean;
	refreshUser: () => Promise<void>;
	logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
	user: null,
	loading: true,
	refreshUser: async () => {},
	logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<UserType>(null);
	const [loading, setLoading] = useState(true);

	const refreshUser: () => Promise<void> = useCallback(async () => {
		setLoading(true);
		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`,
				{
					credentials: "include",
				},
			);
			if (res.ok) {
				const data = await res.json();
				setUser(data.user);
			} else if (res.status === 401) {
				setUser(null);
			} else {
				console.error("Erreur auth/verify : statut inattendu", res.status);
				setUser(null);
			}
		} catch (err) {
			console.error("Erreur auth/verify :", err);
			setUser(null);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		refreshUser();
	}, [refreshUser]);

	const logout = useCallback(async () => {
		await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login/logout`, {
			method: "POST",
			credentials: "include",
		});
		await refreshUser();
	}, [refreshUser]);

	return (
		<AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuthContext = () => useContext(AuthContext);
