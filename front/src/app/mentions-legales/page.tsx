export const metadata = {
	title: "Mentions légales – Zombieland",
	description:
		"Retrouvez les mentions légales de Zombieland, incluant les informations légales, éditeur, hébergeur et conditions d'utilisation du site.",
};

export default function LegalPage() {
	return (
		<main className="max-w-4xl mx-auto px-6 py-12 text-text font-body space-y-8">
			<h2 className="text-3xl sm:text-5xl font-subtitle uppercase text-primary text-center mb-12">
				Informations légales
			</h2>

			{/* MENTIONS LÉGALES */}
			<section
				id="mentions-legales"
				className="bg-surface/70 rounded border-l-4 border-primary p-6 shadow"
			>
				<h3 className="text-xl font-subtitle text-primary-light uppercase mb-4">
					Mentions Légales
				</h3>
				<p className="text-justify leading-relaxed">
					<b>Nom :</b> Zombieland
					<br />
					<b>Forme juridique :</b> Société par actions simplifiée (SAS)
					<br />
					<b>Capital social :</b> 66 666 €<br />
					<b>Siège social :</b> 666 Rue des Cerveaux Affamés, 6666 Zombie,
					France
					<br />
					<b>SIRET :</b> 666 666 666 00066
					<br />
					<b>Directeur de la publication :</b> Zombie McBrainless
					<br />
					<b>Email :</b> contact@zombieland.fr
					<br />
					<b>Téléphone :</b> +33 6 66 66 66 66
				</p>
				<p className="mt-4 text-justify leading-relaxed">
					<b>Hébergement :</b>
					<br />
					Hébergeur : HostBrain
					<br />
					Adresse : 1 Rue des Tombes Oubliées, 66666 Zombieville, France
					<br />
					Téléphone : +33 9 99 99 99 99
				</p>
			</section>

			{/* CGU */}
			<section
				id="cgu"
				className="bg-surface/70 rounded border-l-4 border-primary p-6 shadow"
			>
				<h3 className="text-xl font-subtitle text-primary-light uppercase mb-4">
					Conditions Générales d'Utilisation
				</h3>
				<p className="text-justify leading-relaxed">
					L’utilisation de ce site implique l’acceptation pleine et entière des
					conditions générales d’utilisation décrites ici. Celles-ci peuvent
					être modifiées ou complétées à tout moment, les utilisateurs du site
					Zombieland sont donc invités à les consulter de manière régulière.
				</p>
			</section>

			{/* CONFIDENTIALITÉ */}
			<section
				id="confidentialite"
				className="bg-surface/70 rounded border-l-4 border-primary p-6 shadow"
			>
				<h3 className="text-xl font-subtitle text-primary-light uppercase mb-4">
					Politique de Confidentialité
				</h3>
				<p className="text-justify leading-relaxed">
					Zombieland collecte des informations personnelles relatives à
					l’utilisateur uniquement pour le besoin des services proposés par le
					site. L’utilisateur fournit ces informations en toute connaissance de
					cause, notamment lorsqu’il procède par lui-même à leur saisie.
				</p>
				<p className="mt-2 text-justify leading-relaxed">
					Conformément aux dispositions des articles 38 et suivants de la loi
					78-17, tout utilisateur dispose d’un droit d’accès, de rectification
					et d’opposition aux données personnelles le concernant.
				</p>
			</section>

			{/* ACCESSIBILITÉ */}
			<section
				id="accessibilite"
				className="bg-surface/70 rounded border-l-4 border-primary p-6 shadow"
			>
				<h3 className="text-xl font-subtitle text-primary-light uppercase mb-4">
					Accessibilité
				</h3>
				<p className="text-justify leading-relaxed">
					Zombieland s’engage à rendre son site accessible conformément à
					l’article 47 de la loi n°2005-102. Pour toute demande ou signalement
					concernant l’accessibilité, veuillez nous contacter à
					contact@zombieland.fr.
				</p>
			</section>

			{/* PROPRIÉTÉ INTELLECTUELLE */}
			<section
				id="propriete-intellectuelle"
				className="bg-surface/70 rounded border-l-4 border-primary p-6 shadow"
			>
				<h3 className="text-xl font-subtitle text-primary-light uppercase mb-4">
					Propriété Intellectuelle
				</h3>
				<p className="text-justify leading-relaxed">
					Le contenu du site Zombieland, incluant mais non limité aux textes,
					images, graphismes, logo et icônes, est la propriété exclusive de
					Zombieland. Toute reproduction, représentation, modification,
					publication ou adaptation, même partielle, est interdite sauf
					autorisation écrite préalable.
				</p>
			</section>

			{/* COOKIES */}
			<section
				id="cookies"
				className="bg-surface/70 rounded border-l-4 border-primary p-6 shadow"
			>
				<h3 className="text-xl font-subtitle text-primary-light uppercase mb-4">
					Cookies
				</h3>
				<p className="text-justify leading-relaxed">
					La navigation sur le site Zombieland est susceptible de provoquer
					l’installation de cookie(s) sur l’ordinateur de l’utilisateur afin de
					faciliter la navigation et de mesurer la fréquentation du site.
				</p>
			</section>

			{/* DROIT APPLICABLE */}
			<section
				id="droit-applicable"
				className="bg-surface/70 rounded border-l-4 border-primary p-6 shadow"
			>
				<h3 className="text-xl font-subtitle text-primary-light uppercase mb-4">
					Droit Applicable
				</h3>
				<p className="text-justify leading-relaxed">
					Tout litige en relation avec l’utilisation du site Zombieland est
					soumis au droit français. Il est fait attribution exclusive de
					juridiction aux tribunaux compétents de Zombieville.
				</p>
			</section>
		</main>
	);
}
