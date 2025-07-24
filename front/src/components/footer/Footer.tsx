import { Facebook, Home, Instagram, Mail, Phone } from "lucide-react";
import Link from "next/link";

const legalLinks = [
	{ href: "/mentions-legales#mentions-legales", label: ". Mentions légales" },
	{ href: "/mentions-legales#cgu", label: ". Conditions" },
	{
		href: "/mentions-legales#confidentialite",
		label: ". Politique de confidentialité",
	},
	{ href: "/mentions-legales#accessibilite", label: ". Accessibilité" },
];

export default function Footer() {
	return (
		<footer className="bg-black/40 w-full  text-text  border-t border-primary/30 mt-16">
			<div className="max-w-6xl mx-auto px-4 py-4 lg:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-sm">
				{/* ZOMBIELAND */}
				<div>
					<h3 className="text-primary-light font-subtitle uppercase text-base mb-4">
						Zombieland
					</h3>
					<p className="max-w-xs font-body text-sm">
						ZombieLand, une expérience post-apocalyptique qui ne vous lâchera
						pas... même en bas de page.
					</p>
				</div>

				{/* Contact */}
				<div>
					<h3 className="text-primary-light font-subtitle uppercase text-base mb-4">
						Contact
					</h3>
					<ul className="space-y-2">
						<li className="flex items-start gap-2">
							<Phone className="text-primary w-5 h-5 mt-0.5" />
							<span>06 66 66 66 66</span>
						</li>
						<li className="flex items-start gap-2">
							<Mail className="text-primary w-5 h-5 mt-0.5" />
							<span>contact@zombieland.fr</span>
						</li>
						<li className="flex items-start gap-2">
							<Home className="text-primary w-5 h-5 mt-0.5" />
							<address className="not-italic">
								Zombieland
								<br />
								13 Rue des Morts-Vivants
								<br />
								45200 Amilly
							</address>
						</li>
					</ul>
				</div>

				{/* Réseaux sociaux */}
				<div>
					<h3 className="text-primary-light font-subtitle uppercase text-base mb-4">
						Suivez-nous
					</h3>
					<div className="flex gap-4">
						<a
							href="/"
							aria-label="Instagram"
							className="text-primary hover:text-primary-dark transition-colors"
						>
							<Instagram className="w-6 h-6" />
						</a>
						<a
							href="/"
							aria-label="Facebook"
							className="text-primary hover:text-primary-dark transition-colors"
						>
							<Facebook className="w-6 h-6" />
						</a>
					</div>
				</div>

				{/* Liens légaux */}
				<div>
					<h3 className="text-primary-light font-subtitle uppercase text-base mb-4">
						Infos légales
					</h3>
					<ul className="space-y-2">
						{legalLinks.map(({ href, label }) => (
							<li key={href}>
								<Link
									href={href}
									className="hover:text-primary transition-colors"
								>
									{label}
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>

			{/* Bas de footer */}
			<div className="mt-10 pt-6 border-t border-zinc-800 text-center text-xs text-zinc-500">
				<p>
					&copy; {new Date().getFullYear()} Zombieland. Tous droits réservés.
					Pas responsable en cas de morsure.
				</p>
			</div>
		</footer>
	);
}
