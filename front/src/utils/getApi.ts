export function getApiUrl(): string {
	if (typeof window === "undefined") {
		//  (SSR)
		return process.env.API_URL ?? "http://back:5000/api";
	} else {
		// (CSR)
		return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
	}
}
