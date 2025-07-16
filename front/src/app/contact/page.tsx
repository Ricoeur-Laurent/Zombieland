import ContactForm from "@/components/contact/ContactForm";

export const metadata = {
	title: "Zombieland Contact",
	description: "Formulaire de contact pour nous écrire facilement.",
};

export default function ContactPage() {
	return (
		<main className="flex flex-col items-center justify-between min-h-screen px-4 py-12">
			<div className="w-full flex flex-col items-center">
				<h2 className="text-center text-3xl sm:text-5xl font-subtitle uppercase text-primary mb-8">
					Contactez-nous
				</h2>
				<ContactForm />
			</div>
		</main>
	);
}


