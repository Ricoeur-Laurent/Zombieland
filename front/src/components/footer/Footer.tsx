// src/components/Footer.tsx

import { Facebook, Home, Instagram, Mail, Phone } from "lucide-react";
import Link from "next/link";

// List of legal links pointing to sections of the same page via anchors
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
		<footer className="py-8 px-6">
			<div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
				{/* ZOMBIELAND */}
				<div>
					<h3 className="text-primary-light font-subtitle uppercase mb-4">
						Zombieland
					</h3>
					<p className="text-text font-body max-w-xs">
						ZombieLand, une expérience post-apocalyptique qui ne vous lâchera
						pas... même en bas de page
					</p>
				</div>

				{/* Contact information */}
				<div>
					<h3 className="text-primary-light font-subtitle uppercase mb-4">
						Nous contacter
					</h3>
					<ul className="text-text font-body space-y-2">
						<li className="flex items-center gap-2">
							<Phone className="text-primary w-5 h-5" />
							<span>0666.66.66.66</span>
						</li>
						<li className="flex items-center gap-2">
							<Mail className="text-primary w-5 h-5" />
							<span>zombie@zombie.com</span>
						</li>
						<li className="flex items-center gap-2">
							<Home className="text-primary w-5 h-5" />
							<span>
								zombie
								<br />
								6666 zombie
							</span>
						</li>
					</ul>
				</div>

				{/* Social media icons */}
				<div>
					<h3 className="text-primary-light font-subtitle uppercase mb-4">
						Suivez-nous
					</h3>
					<div className="flex gap-4 text-primary text-2xl">
						<a href="/" aria-label="Instagram">
							<Instagram className="w-6 h-6" />
						</a>
						<a href="/" aria-label="Facebook">
							<Facebook className="w-6 h-6" />
						</a>
					</div>
				</div>

				{/* Legal links mapped from array */}
				<div>
					<h3 className="text-primary-light font-subtitle uppercase mb-4">
						Infos légales
					</h3>
					<ul className="text-text font-body space-y-2">
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
		</footer>
	);
}
