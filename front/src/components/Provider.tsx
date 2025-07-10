"use client";

import { TokenProvider } from "@/context/TokenProvider";

export function Providers({ children }: { children: React.ReactNode }) {
	return <TokenProvider>{children}</TokenProvider>;
}
