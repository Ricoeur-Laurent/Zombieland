"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * AgeGateModal prompts the user to confirm their age
 * before accessing the site content.
 * It stores the confirmation in sessionStorage.
 */
export default function AgeGateModal() {
	const [show, setShow] = useState(false);
	const router = useRouter();

	// On mount, check if user has already confirmed their age
	useEffect(() => {
		const consent = sessionStorage.getItem("zombieland_age_confirmed");
		if (!consent) {
			setShow(true);
		}
	}, []);
	// Confirms the user is of age and stores it in sessionStorage
	const handleConfirm = () => {
		sessionStorage.setItem("zombieland_age_confirmed", "true");
		setShow(false);
	};
	// Redirects user elsewhere if underage or unwilling to confirm
	const handleReject = () => {
		router.push(
			"https://www.google.com/search?sca_esv=138a3742daa9c452&sxsrf=AE3TifPqsFoRbaVpVSGx3f-K0DfU87e-Zw:1752740747373&q=licorne+rose&udm=2&fbs=AIIjpHx4nJjfGojPVHhEACUHPiMQ_pbg5bWizQs3A_kIenjtcpTTqBUdyVgzq0c3_k8z34FKdUNCNiw5OX_lAsIf8VARkJlz8RgwV9hAA9ihAWM56o_KZ_hdAHw9inu0F3_vijzw5C3iQIFOIUzByQ9kogWY6lAi8K1XaO-RG6wwhlD_0TuvBDNTIXwFnHHi4MN27cUt6h1XlH7_rMVuO2vLKe_kLEPjNQ&sa=X&sqi=2&ved=2ahUKEwjVvIWNvMOOAxVkQ6QEHRl6PZYQtKgLKAF6BAgiEAE&biw=1438&bih=1134&dpr=1",
		);
	};
	// If modal not needed, render nothing
	if (!show) return null;

	return (
		<div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center px-4">
			<div className="bg-bg p-6 rounded-xl text-white max-w-md w-full text-center border border-primary shadow-xl">
				<h2 className="text-2xl font-bold mb-4">Âge requis</h2>
				<p className="mb-6">
					Ce site contient du contenu susceptible de choquer les moins de 16
					ans. Veuillez confirmer que vous avez l'âge requis pour entrer dans
					ZombieLand.
				</p>
				<div className="flex justify-center gap-4">
					<button
						type="button"
						onClick={handleConfirm}
						className="bg-primary hover:bg-primary/90 transition px-6 py-3 rounded font-semibold"
					>
						Oui, j’ai l’âge requis
					</button>
					<button
						type="button"
						onClick={handleReject}
						className="bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded font-semibold"
					>
						Non
					</button>
				</div>
			</div>
		</div>
	);
}
