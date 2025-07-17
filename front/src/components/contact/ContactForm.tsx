"use client";
import emailjs from "@emailjs/browser";
import { type FormEvent, useState } from "react";
import { useTokenContext } from "@/context/TokenProvider";

export default function ContactForm() {
	const { token } = useTokenContext();
	const [firstname, setFirstName] = useState("");
	const [lastname, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError("");
		setSuccess("");

		// Prepare data object to send to EmailJS, keys must match template variables
		const formData = {
			firstname: firstname,
			lastname: lastname,
			email: email,
			message: message,
			reply_to: email,
		};

		try {
			// Send email using EmailJS service, template, and public key from env variables
			await emailjs.send(
				process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
				process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
				formData,
				process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
			);

			// Set success message if email was sent
			setSuccess("Message envoyé avec succès !");

			// Clear form fields after sending
			setFirstName("");
			setLastName("");
			setEmail("");
			setMessage("");
		} catch (error) {
			console.error(error);
			setError("Erreur lors de l’envoi du message.");
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-4 w-full max-w-xl mx-auto bg-surface bg-opacity-90 backdrop-blur-sm p-6 rounded-lg border border-primary shadow-lg"
		>
			{/* Champ prénom */}
			<div className="flex flex-col">
				<label
					htmlFor="firstname"
					className="text-primary-light font-subtitle uppercase text-xl"
				>
					Prénom
				</label>
				<input
					type="text"
					id="firstname"
					value={firstname}
					onChange={(e) => setFirstName(e.target.value)}
					required
					className="bg-bg text-text border border-muted rounded-lg px-3 py-2 placeholder:text-muted focus:outline-none focus:border-primary"
					placeholder=""
				/>
			</div>

			{/* Champ nom */}
			<div className="flex flex-col">
				<label
					htmlFor="lastname"
					className="text-primary-light font-subtitle uppercase text-xl"
				>
					Nom
				</label>
				<input
					type="text"
					id="lastname"
					value={lastname}
					onChange={(e) => setLastName(e.target.value)}
					required
					className="bg-bg text-text border border-muted rounded-lg px-3 py-2 placeholder:text-muted focus:outline-none focus:border-primary"
					placeholder="Votre nom"
				/>
			</div>

			{/* Champ email */}
			<div className="flex flex-col">
				<label
					htmlFor="email"
					className="text-primary-light font-subtitle uppercase text-xl"
				>
					Email
				</label>
				<input
					type="email"
					id="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
					className="bg-bg text-text border border-muted rounded-lg px-3 py-2 placeholder:text-muted focus:outline-none focus:border-primary"
					placeholder="votre@email.com"
				/>
			</div>

			{/* Champ message */}
			<div className="flex flex-col">
				<label
					htmlFor="message"
					className="text-primary-light font-subtitle uppercase text-xl"
				>
					Message
				</label>
				<textarea
					id="message"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					required
					rows={5}
					className="bg-bg text-text border border-muted rounded-lg px-3 py-2 placeholder:text-muted focus:outline-none focus:border-primary"
					placeholder="Votre message"
				/>
			</div>

			{/* Affichage des messages d'erreur ou de succès */}
			{error && <p className="text-red-500 text-sm font-body">{error}</p>}
			{success && <p className="text-green-600 text-sm font-body">{success}</p>}

			{/* Bouton d'envoi */}
			<button
				type="submit"
				className="bg-primary text-black font-subtitle uppercase tracking-wide py-2 rounded-lg hover:bg-primary-dark transition"
			>
				Envoyer
			</button>
		</form>
	);
}
