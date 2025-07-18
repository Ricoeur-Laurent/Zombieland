// src/app/layout.tsx
import type { Metadata } from "next";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import "./globals.css";
import AgeGateModal from "@/components/legalAge/AgeGateModal";
import { Providers } from "@/components/provider/Provider";

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
			<head>
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="/favicon/apple-touch-icon.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="32x32"
					href="/favicon/favicon-32x32.png"
				/>
				<link
					rel="icon"
					type="image/png"
					sizes="16x16"
					href="/favicon/favicon-16x16.png"
				/>
				<link rel="manifest" href="/site.webmanifest" />
			</head>
			<body className="min-h-screen flex flex-col bg-bg text-text">
				<Providers>
					<AgeGateModal />
					<Header />
					<main className="flex-1">{children}</main>
					<Footer />
				</Providers>
			</body>
		</html>
	);
}
