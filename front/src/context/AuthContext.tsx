// Fichier : AuthContext.tsx

import type React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

// Defines the shape of a user object or null if not authenticated
type UserType = {
	id: number;
	firstname: string;
	lastname: string;
	phone: string;
	email: string;
	admin: boolean;
} | null;
// The context value shared throughout the app
type AuthContextType = {
	user: UserType;
	loading: boolean;
	refreshUser: () => Promise<void>;
	logout: () => Promise<void>;
};
// Default context values (mostly used for TypeScript fallback)
const AuthContext = createContext<AuthContextType>({
	user: null,
	loading: true,
	refreshUser: async () => {},
	logout: async () => {},
});
// Provider component wrapping the app tree to provide authentication state
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<UserType>(null); // Holds the authenticated user
	const [loading, setLoading] = useState(true); // Indicates if we're still checking the auth status

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
				//we got an error 401 when someone not connected log for the first time, its the awaited comportment, and it's fine.
			} else if (res.status === 401) {
				setUser(null); // Not authenticated
			} else {
				console.error("Erreur auth/verify : statut inattendu", res.status);
				setUser(null);
			}
		} catch (err) {
			console.error("Erreur auth/verify :", err);
			setUser(null);
		} finally {
			setLoading(false); // Auth check is complete
		}
	}, []);
	// Automatically fetch user data on component mount
	useEffect(() => {
		refreshUser();
	}, [refreshUser]);
	// Logs the user out by hitting the backend and refreshing the state
	const logout = useCallback(async () => {
		await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login/logout`, {
			method: "POST",
			credentials: "include", // Needed to clear the session cookie
		});
		await refreshUser(); // Update state after logout
	}, [refreshUser]);

	// Provide the context to all children components
	return (
		<AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
// Custom hook for accessing the auth context
export const useAuthContext = () => useContext(AuthContext);
