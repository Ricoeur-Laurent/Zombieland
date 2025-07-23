"use client";

import { AuthProvider } from "@/context/AuthContext";

// This component wraps the entire app with the global context providers.
export function Providers({ children }: { children: React.ReactNode }) {
	// Provides access to authentication state and actions throughout the app
	return <AuthProvider>{children}</AuthProvider>;
}
