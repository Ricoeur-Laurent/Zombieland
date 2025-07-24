import ContactForm from "@/components/contact/ContactForm";
import { Suspense } from "react";

export const metadata = {
	title: "Contact - Zombieland ",
	description: "Formulaire de contact pour nous écrire facilement.",
};

export default function ContactPage() {
	return (
		<div className="px-4 py-6 max-w-6xl mx-auto">
			<h2 className="text-center text-3xl sm:text-5xl font-subtitle uppercase text-primary mb-8">
				Contactez-nous
			</h2>
				<Suspense fallback={<p className="text-center mt-6">Chargement...</p>}>
					<ContactForm />
				</Suspense>
		</div>
		
	);
}


