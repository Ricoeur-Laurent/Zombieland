// src/app/layout.tsx
import type { Metadata } from "next";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import "./globals.css";
import AgeGateModal from "@/components/legalAge/AgeGateModal";
import { Providers } from "@/components/provider/Provider";
// <head> metadata: applied to all pages unless overridden
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
				{/* Favicon and PWA manifest links */}
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
				<link rel="manifest" href="/favicon/site.webmanifest" />
			</head>
			<body className="min-h-screen flex flex-col bg-bg text-text">
				{/* Global context providers */}
				<Providers>
					{/* Age verification modal – shown on first visit if required */}
					<AgeGateModal />
					{/* App-wide navigation header */}
					<Header />
					{/* Main dynamic content */}
					<main className="flex-1">{children}</main>
					{/* Footer is always visible */}
					<Footer />
				</Providers>
			</body>
		</html>
	);
}
