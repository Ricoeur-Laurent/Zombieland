import ContactForm from "@/components/contact/ContactForm";

export const metadata = {
	title: "Zombieland Contact",
	description: "Formulaire de contact pour nous écrire facilement.",
};

export default function ContactPage() {
	return (
		<main className="flex flex-col items-center justify-between min-h-screen px-4 py-12">
			<div className="w-full flex flex-col items-center">
				<h1 className="text-4xl font-title text-primary mb-8 uppercase tracking-wide">
					Contactez-nous
				</h1>
				<ContactForm />
			</div>
		</main>
	);
}


