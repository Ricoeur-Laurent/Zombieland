"use client";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
	return (
		<section className="relative w-full h-[90vh] flex items-center justify-center">
			{/* Image */}
			<Image
				src="/images/desktop/404.webp"
				alt="ZombieLand - 404"
				fill
				className="object-cover"
			/>

			{/* Overlay */}
			<div className="absolute inset-0 bg-black/40 flex items-center justify-center px-4">
				<div className="bg-surface/80 p-6 sm:p-10 max-w-xl text-center rounded-lg">
					<h2 className="text-4xl  font-subtitle text-red-600 mb-4">
						404 - Page non trouvée
					</h2>
					<p className="text-text font-body text-sm sm:text-base mb-6">
						Cette page a été dévorée dans les ténèbres de ZombieLand...
					</p>
					<Link
						href="/"
						className="flex justify-center gap-3 rounded-lg bg-primary px-6 py-2 font-bold text-bg transition hover:bg-primary-dark uppercase"
					>
						<ArrowLeft className="w-5 h-5" />
						Retour à la base des survivants
					</Link>
				</div>
			</div>
		</section>
	);
}
