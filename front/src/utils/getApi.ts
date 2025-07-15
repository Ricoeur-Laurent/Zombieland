export function getApiUrl(): string {
	if (typeof window === "undefined") {
		// Exécuté côté serveur (SSR)
		return process.env.API_URL ?? "http://back:5000/api";
	} else {
		// Exécuté côté client (CSR)
		return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
	}
}
