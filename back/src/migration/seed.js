import bcrypt from "bcrypt";

import {
	Attractions,
  Categories,
  Reservations,
  Reviews,
  sequelize,
  Users,
} from "../models/index.js";

async function seed() {

	try {
		
		const categories = await Categories.bulkCreate([
			{ name: "Survival" },
			{ name: "Escape Game" },
			{ name: "Manège" },
			{ name: "Simulation urbaine" },
			{ name: "Paintball" },
			{ name: "VR" },
		]);

		const attractions = await Attractions.bulkCreate([
			{
				name: `Le Dédale Maudit`,
				slug: `le-dédale-maudit`,
				image: `le-dédale-maudit.jpg`,
				description: `Entrez si vous l’osez… Le Zombie Labyrinthe vous ouvre ses portes, mais rien ne garantit que vous en sortirez indemne !\nDans ce labyrinthe sombre et angoissant, chaque détour peut cacher l’impensable. Des créatures contaminées rôdent dans l’ombre, affamées de chair humaine, prêtes à bondir au moindre bruit… Votre mission : trouver la sortie, éviter les pièges et surtout… ne pas vous faire mordre !\nEntre effets spéciaux, ambiance immersive et décors à couper le souffle, cette attraction est réservée aux plus courageux. Êtes-vous prêt à affronter vos peurs les plus profondes ?`,
			},
			{
				name: `Le Manoir des Âmes Perdues`,
				slug: `le-manoir-des-âmes-perdues`,
				image: `le-manoir-des-âmes-perdues.jpg`,
				description: `Bienvenue dans le Manoir Zombie, un ancien domaine abandonné depuis des décennies… ou presque. Des rumeurs parlent d’expériences interdites, de cris dans la nuit… et de morts revenus à la vie.\nVous et votre équipe êtes envoyés en mission pour enquêter. Une fois les portes refermées derrière vous, une seule chose est sûre : le compte à rebours a commencé.\nVous avez 60 minutes pour explorer les lieux, résoudre les énigmes et échapper aux griffes des zombies avant qu’il ne soit trop tard…\n Un escape game immersif mêlant horreur, suspense et réflexion\nÉnigmes, fouilles, manipulations… chaque indice compte\nLes zombies rôdent… restez sur vos gardes à chaque instant\nActeurs en chair et (putréfaction) os pour une tension maximale !`,
			},
			{
				name: `L’Enfer en Soins Intensifs`,
				slug: `lenfer-en-soins-intensifs`,
				image: `lenfer-en-soins-intensifs.jpg`,
				description: `Autrefois centre psychiatrique isolé, l’Asile Saint-Croix a été placé sous quarantaine après une série de tests médicaux ayant viré au cauchemar. Aujourd’hui, il ne reste que des cris étouffés, des couloirs délabrés… et des patients qui refusent de mourir.\nVous êtes une équipe de secours envoyée pour retrouver les derniers survivants. Mais à peine entrés, les portes se referment derrière vous. Les sirènes hurlent. Le virus est dans l’air.\nEt les zombies… ne sont plus seuls.\nRésolvez les énigmes de cet asile maudit\nÉvitez les infectés, ou ils vous traqueront sans relâche\n60 minutes pour fuir… ou rejoindre leurs rangs`,
			},
			{
				name: `Le Virus Express`,
				slug: `le-virus-express`,
				image: `le-virus-express.jpg`,
				description: `Les morts se sont relevés… et ils ont pris le contrôle des rails.\nBienvenue à bord du Grand Huit de la Mort Zombie, une attraction explosive où vitesse vertigineuse et horreur post-apocalyptique s'entremêlent !\nAccrochez-vous : hurlements dans l’obscurité, descentes infernales, tunnels infestés, explosions, flammes… et des zombies surgissant des ténèbres à chaque virage.\nUne expérience multisensorielle entre montagnes russes et film d’horreur vivant\nBruits de sirènes, lumières stroboscopiques, fumée… et surprises à chaque boucle\nAttention : certains zombies sont peut-être plus proches que vous ne le pensez…`,
			},
			{
				name: `Speed Apocalypse`,
				slug: `speed-apocalypse`,
				image: `speed-apocalypse.jpg`,
				description: `Préparez-vous à prendre le volant… si vous n’avez pas peur des morts-vivants au volant !\nDans la Course des Zombies, c’est vitesse, adrénaline et chaos garantis ! Affrontez des pilotes déchaînés dans un circuit infernal infesté de zombies affamés et de pièges mortels.\nBoosters, virages serrés, collisions spectaculaires…\nÉvitez les hordes de zombies qui tentent de vous ralentir à tout prix\nPersonnalisez votre bolide pour survivre à cette course apocalyptique`,
			},
			{
				name: `Vertige Mortel`,
				slug: `vertige-mortel`,
				image: `vertige-mortel.jpg`,
				description: `Montez à bord de la Grande Roue des Zombies et découvrez l’apocalypse comme jamais auparavant.\nÀ chaque tour, vous vous rapprochez un peu plus des morts-vivants… ou peut-être qu’ils s’approchent de vous ?\nProfitez d’une vue imprenable sur un paysage dévasté, plongé dans une atmosphère inquiétante, entre bruits lugubres, fumée mystérieuse et effets visuels effrayants.\nRessentez la tension monter pendant que l’ombre des zombies plane sous vos pieds.\nUne expérience mêlant détente et frissons\nEffets sonores et lumières pour une ambiance immersive\nParfait pour ceux qui aiment frissonner en hauteur`,
			},
			{
				name: `Chasse Mortelle`,
				slug: `chasse-mortelle`,
				image: `chasse-mortelle.jpg`,
				description: `Préparez-vous à vivre une expérience explosive où l’adrénaline est au maximum !\nDans la Chasse aux Zombies, vous incarnez un survivant dans un monde envahi par les morts-vivants. Armé de votre paintball, votre mission est simple : éliminer les zombies avant qu’ils ne vous attrapent.\nStratégie, rapidité et précision seront vos meilleurs alliés\nAffrontez des équipes de zombies en chair et en peinture\nTerrain immersif avec cachettes, obstacles et effets sonores angoissants`,
			},
			{
				name: `Prison Hors du Temps`,
				slug: `prison-hors-du-temps`,
				image: `prison-hors-du-temps.jpg`,
				description: `Bienvenue dans une prison pas comme les autres…\nIci, le temps ne suit plus ses règles, les secondes s’étirent, les heures se confondent, et chaque moment peut être votre dernier.\nVous êtes enfermés dans une cellule hors du temps, où passé, présent et futur se mêlent dans un décor énigmatique et oppressant.\nPour espérer retrouver la liberté, vous devrez déchiffrer les mystères du lieu, résoudre des énigmes temporelles et affronter vos peurs les plus profondes.\nUne expérience immersive où chaque détail compte\nDes mécanismes surprenants et des énigmes à plusieurs niveaux\nLe temps est votre ennemi… et votre allié`,
			},
			{
				name: `Clinique du Chaos`,
				slug: `clinique-du-chaos`,
				image: `clinique-du-chaos.jpg`,
				description: `Vous ouvrez les yeux dans un hôpital désert, les couloirs sont vides, les néons vacillent, et un silence oppressant règne…\nMais quelque chose ne tourne pas rond : à l’extérieur, le chaos a éclaté. L’invasion des infectés a transformé le monde en un cauchemar vivant.\nÀ peine sorti de votre coma, vous devez explorer cet hôpital abandonné, chercher des indices, des survivants… et surtout, éviter les créatures affamées qui rôdent encore dans l’ombre.\nChaque pièce recèle un danger, chaque bruit peut être le dernier.\nAmbiance sombre et tendue, effets sonores angoissants\nRésolvez les mystères du réveil et découvrez ce qui s’est passé\nVivez une immersion intense à la 28 jours plus tard`,
			},
			{
				name: `Les Ombres du Cimetière`,
				slug: `les-ombres-du-cimetière`,
				image: `les-ombres-du-cimetière.jpg`,
				description: `La nuit tombe sur un vieux cimetière abandonné…\nSoudain, la terre se fissure, les tombes s’ouvrent, et les morts reprennent vie pour hanter les vivants !\nOserez-vous vous aventurer dans ce lieu maudit où chaque pas peut réveiller des hordes de zombies affamés ?\nParcourez les allées sombres, évitez les pièges et préparez-vous à des rencontres terrifiantes… car ici, la mort n’est qu’un début.\nAtmosphère lugubre et brumeuse\nZombies surgissant du sol avec effets spéciaux réalistes\nN’hésitez pas à venir équipé d’une lampe torche… vous en aurez besoin !`,
			},
			{
				name: `Les Bois Maudits`,
				slug: `les-bois-maudits`,
				image: `les-bois-maudits.jpg`,
				description: `Entrez dans la forêt… si vous osez !\nSous l’épais couvert des arbres, une horde de zombies rôde, affamée et sans pitié. Chaque bruissement de feuilles, chaque craquement de branche pourrait être le signe de votre fin.\nDans cette zone sauvage et inquiétante, vous devrez avancer prudemment, éviter les embuscades et surtout, garder votre sang-froid face à ces morts-vivants prêts à bondir à tout instant.\nUne expérience immersive mêlant exploration, frissons et survie.\nAtmosphère oppressante au cœur de la nature\nZombies cachés, effets sonores terrifiants\nLampe torche recommandée pour ne pas se perdre dans l’obscurité`,
			},
			{
				name: `Tunnel Sans Retour`,
				slug: `tunnel-sans-retour`,
				image: `tunnel-sans-retour.jpg`,
				description: `Vous êtes enfermés dans une voiture, filant à toute vitesse à travers un tunnel sombre, au cœur d’une évasion explosive.\nAutour de vous, les murs vibrent, les sirènes hurlent, et à l’extérieur… la horde de zombies déchaînés se rapproche dangereusement.\nDans ce voyage intense, chaque seconde compte : évitez les embûches, survivez aux collisions et ressentez l’adrénaline pure du breakout.\nSerez-vous capables de franchir la sortie avant que la nuit ne vous engloutisse ?\nEffets spéciaux à bord : vibrations, sons immersifs, lumières stroboscopiques\nAmbiance post-apocalyptique et course-poursuite haletante`,
			},
			{
				name: `Route Z`,
				slug: `route-z`,
				image: `route-z.jpg`,
				description: `Plongés au cœur d’une ville dévastée, vous prenez place dans une voiture qui file à toute vitesse à travers des rues envahies par une marée humaine de zombies affamés.\nL’atmosphère est électrique, les cris retentissent, les sirènes hurlent, tandis que des centaines, puis des milliers de morts-vivants déferlent en une vague implacable, rappelant la scène mythique de World War Z.\nChaque virage est une course contre la mort, chaque embouteillage une épreuve de survie. Ressentez la panique et l’urgence dans cette poursuite haletante où l’espoir vacille à chaque instant.\nPouvez-vous tenir le rythme, esquiver les obstacles et échapper à cette horde déchaînée avant qu’elle ne vous engloutisse ?\nEffets spéciaux puissants : vibrations, lumières stroboscopiques, sons immersifs et fumée\n Une expérience sensorielle intense, fidèle à l’ambiance apocalyptique du film`,
			},
		]);

		await attractions[0].addCategories([categories[0]]);
		await attractions[1].addCategories([categories[1]]);
		await attractions[2].addCategories([categories[1]]);
		await attractions[3].addCategories([categories[2]]);
		await attractions[4].addCategories([categories[3]]);
		await attractions[5].addCategories([categories[2]]);
		await attractions[6].addCategories([categories[4]]);
		await attractions[7].addCategories([categories[1]]);
		await attractions[8].addCategories([categories[0]]);
		await attractions[9].addCategories([categories[0]]);
		await attractions[10].addCategories([categories[0]]);
		await attractions[11].addCategories([categories[3]]);
		await attractions[12].addCategories([categories[5]]);

		const hashedPasswordAdmin = await bcrypt.hash("admin", 10);
		const hashedPasswordUser = await bcrypt.hash("user", 10);
		const hashedPasswordUser2 = await bcrypt.hash("user2", 10);

		const users = await Users.bulkCreate([
			{
				firstname: "Admin",
				lastname: "Zombie",
				email: "admin@zombie.com",
				password: hashedPasswordAdmin,
				phone: "0600000001",
				admin: true,
			},
			{
				firstname: "User",
				lastname: "Zombie",
				email: "user@zombie.com",
				password: hashedPasswordUser,
				phone: "0600000002",
				admin: false,
			},
			{
				firstname: "User2",
				lastname: "Zombie",
				email: "user2@zombie.com",
				password: hashedPasswordUser2,
				phone: "0600000003",
				admin: false,
			},
		]);

		const reservations = await Reservations.bulkCreate([
			{
				visit_date: "2025-09-30",
				amount: 44.64,
				nb_participants: 1,
				userId: users[0].id,
			},
			{
				visit_date: "2025-09-25",
				amount: 25.66,
				nb_participants: 5,
				userId: users[1].id,
			},
			{
				visit_date: "2025-07-26",
				amount: 92.15,
				nb_participants: 4,
				userId: users[2].id,
			},
			{
				visit_date: "2025-09-27",
				amount: 24.69,
				nb_participants: 1,
				userId: users[0].id,
			},
			{
				visit_date: "2025-09-05",
				amount: 78.1,
				nb_participants: 3,
				userId: users[1].id,
			},
		]);

		const reviews = await Reviews.bulkCreate([
			{
				rating: 3,
				comment: `Incroyable ! Une immersion totale.`,
				userId: users[0].id,
				attractionId: attractions[0].id,
			},
			{
				rating: 4,
				comment: `Terrifiant mais génial.`,
				userId: users[1].id,
				attractionId: attractions[1].id,
			},
			{
				rating: 4,
				comment: `À refaire avec des amis !`,
				userId: users[2].id,
				attractionId: attractions[2].id,
			},
			{
				rating: 4,
				comment: `Frissons garantis, top !`,
				userId: users[0].id,
				attractionId: attractions[3].id,
			},
			{
				rating: 4,
				comment: `Expérience inoubliable !`,
				userId: users[1].id,
				attractionId: attractions[4].id,
			},
		]);


		console.log('Données insérées avec succès');
		// process.exit();
	} catch (error) {
		console.error('Erreur pendant le seed :', error);
		process.exit(1);
	}
}

// seed();

export default seed;
