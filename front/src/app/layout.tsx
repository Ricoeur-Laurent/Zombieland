// src/app/layout.tsx
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import "./globals.css";
import { Providers } from "@/components/Provider";

export const metadata: Metadata = {
	title: "ZombieLand",
	description:
		"Vivez l'expérience post-apocalyptique ultime dans notre parc ZombieLand.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="fr">
			<body>
				<Providers>
				<Header />
				{children}
				<Footer />
				</Providers>
				
			</body>
		</html>
	);
}
