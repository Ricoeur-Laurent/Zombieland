export const metadata = {
	title: "Mentions légales – Zombieland",
	description:
		"Retrouvez les mentions légales de Zombieland, incluant les informations légales, éditeur, hébergeur et conditions d'utilisation du site.",
};

export default function LegalPage() {
	return (
		<main className="max-w-3xl mx-auto px-6 py-12 text-text font-body space-y-12">
			{/* MENTIONS LEGALES , les id servent pour l'ancrage sur le footer*/}
			<section id="mentions-legales">
				<h1 className="text-3xl font-subtitle text-primary-light uppercase mb-4">
					Mentions légales
				</h1>
				<p className="text-justify">
					<b>Identification de l'éditeur du site</b>
					<br />
					Nom : Zombieland
					<br />
					Forme juridique : Société par actions simplifiée (SAS)
					<br />
					Capital social : 66 666 €<br />
					Siège social : 666 Rue des Cerveaux Affamés, 6666 Zombie, France
					<br />
					Numéro SIRET : 666 666 666 00066
					<br />
					Directeur de la publication : Zombie McBrainless
					<br />
					Email : contact@zombieland.fr
					<br />
					Téléphone : +33 6 66 66 66 66
				</p>
				<p className="mt-4 text-justify">
					<b>Hébergement</b>
					<br />
					Hébergeur : HostBrain
					<br />
					Adresse : 1 Rue des Tombes Oubliées, 66666 Zombieville, France
					<br />
					Téléphone : +33 9 99 99 99 99
				</p>
			</section>

			{/* CGU */}
			<section id="cgu">
				<h2 className="text-2xl font-subtitle text-primary-light uppercase mb-4">
					Conditions Générales d'Utilisation
				</h2>
				<p className="text-justify">
					L’utilisation de ce site implique l’acceptation pleine et entière des
					conditions générales d’utilisation décrites ici. Celles-ci peuvent
					être modifiées ou complétées à tout moment, les utilisateurs du site
					Zombieland sont donc invités à les consulter de manière régulière.
				</p>
			</section>

			{/* CONFIDENTIALITE */}
			<section id="confidentialite">
				<h2 className="text-2xl font-subtitle text-primary-light uppercase mb-4">
					Politique de Confidentialité
				</h2>
				<p className="text-justify">
					Zombieland collecte des informations personnelles relatives à
					l’utilisateur uniquement pour le besoin des services proposés par le
					site. L’utilisateur fournit ces informations en toute connaissance de
					cause, notamment lorsqu’il procède par lui-même à leur saisie.
				</p>
				<p className="mt-2 text-justify">
					Conformément aux dispositions des articles 38 et suivants de la loi
					78-17, tout utilisateur dispose d’un droit d’accès, de rectification
					et d’opposition aux données personnelles le concernant.
				</p>
			</section>

			{/* ACCESSIBILITE */}
			<section id="accessibilite">
				<h2 className="text-2xl font-subtitle text-primary-light uppercase mb-4">
					Accessibilité
				</h2>
				<p className="text-justify">
					Zombieland s’engage à rendre son site accessible conformément à
					l’article 47 de la loi n°2005-102. Pour toute demande ou signalement
					concernant l’accessibilité, veuillez nous contacter à
					contact@zombieland.fr.
				</p>
			</section>

			{/* PROPRIETE INTELLECTUELLE */}
			<section id="propriete-intellectuelle">
				<h2 className="text-2xl font-subtitle text-primary-light uppercase mb-4">
					Propriété Intellectuelle
				</h2>
				<p className="text-justify">
					Le contenu du site Zombieland, incluant mais non limité aux textes,
					images, graphismes, logo et icônes, est la propriété exclusive de
					Zombieland. Toute reproduction, représentation, modification,
					publication, adaptation de tout ou partie des éléments est interdite
					sauf autorisation écrite préalable.
				</p>
			</section>

			{/* COOKIES */}
			<section id="cookies">
				<h2 className="text-2xl font-subtitle text-primary-light uppercase mb-4">
					Cookies
				</h2>
				<p className="text-justify">
					La navigation sur le site Zombieland est susceptible de provoquer
					l’installation de cookie(s) sur l’ordinateur de l’utilisateur afin de
					faciliter la navigation et de mesurer la fréquentation du site.
				</p>
			</section>

			{/* DROIT APPLICABLE */}
			<section id="droit-applicable">
				<h2 className="text-2xl font-subtitle text-primary-light uppercase mb-4">
					Droit Applicable
				</h2>
				<p className="text-justify">
					Tout litige en relation avec l’utilisation du site Zombieland est
					soumis au droit français. Il est fait attribution exclusive de
					juridiction aux tribunaux compétents de Zombieville.
				</p>
			</section>
		</main>
	);
}
