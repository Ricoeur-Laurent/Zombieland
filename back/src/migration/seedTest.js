import bcrypt from 'bcrypt';

import {
	Attractions,
	Categories,
	Reservations,
	Reviews,
	sequelize,
	Users,
} from '../models/index.js';

async function seed() {
	try {
		await sequelize.sync({ force: true });

		// Créer les catégories
		const categories = await Categories.bulkCreate([
			{ name: 'Survival' },
			{ name: 'Escape Game' },
			{ name: 'Manege' },
			{ name: 'Simulation urbaine' },
			{ name: 'Paintball' },
			{ name: 'VR' },
		]);

		// Créer les attractions
		const attractions = await Attractions.bulkCreate([
			{
				name: `Le Dedale Maudit`,
				slug: `le-dédale-maudit`,
				image: `le-dédale-maudit.jpg`,
				description: `Entrez si vous l’osez… Le Zombie Labyrinthe vous ouvre ses portes, mais rien ne garantit que vous en sortirez indemne !`,
			},
			{
				name: `Le Manoir des Ames Perdues`,
				slug: `le-manoir-des-âmes-perdues`,
				image: `le-manoir-des-âmes-perdues.jpg`,
				description: `Bienvenue dans le Manoir Zombie, un ancien domaine abandonné…`,
			},
			{
				name: `L’Enfer en Soins Intensifs`,
				slug: `lenfer-en-soins-intensifs`,
				image: `lenfer-en-soins-intensifs.jpg`,
				description: `Autrefois centre psychiatrique isolé, l’Asile Saint-Croix a été placé sous quarantaine…`,
			},
		]);

		// Lier attractions et catégories
		await attractions[0].addCategories([categories[0]]);
		await attractions[1].addCategories([categories[1]]);
		await attractions[2].addCategories([categories[2]]);

		// Hasher les mots de passe
		const hashedPasswordAdmin = await bcrypt.hash('admin', 10);
		const hashedPasswordUser = await bcrypt.hash('user', 10);
		const hashedPasswordUser2 = await bcrypt.hash('user2', 10);

		// Créer les utilisateurs
		const users = await Users.bulkCreate([
			{
				firstname: 'Admin',
				lastname: 'Zombie',
				email: 'admin@zombie.com',
				password: hashedPasswordAdmin,
				phone: '0600000001',
				admin: true,
			},
			{
				firstname: 'User',
				lastname: 'Zombie',
				email: 'user@zombie.com',
				password: hashedPasswordUser,
				phone: '0600000002',
				admin: false,
			},
			{
				firstname: 'User2',
				lastname: 'Zombie',
				email: 'user2@zombie.com',
				password: hashedPasswordUser2,
				phone: '0600000003',
				admin: false,
			},
		]);

		// Créer les réservations
		await Reservations.bulkCreate([
			{
				visit_date: '2025-09-30',
				amount: 66,
				nb_participants: 1,
				userId: users[0].id,
			},
			{
				visit_date: '2025-09-25',
				amount: 330,
				nb_participants: 5,
				userId: users[1].id,
			},
			{
				visit_date: '2025-07-26',
				amount: 264,
				nb_participants: 4,
				userId: users[2].id,
			},
			{
				visit_date: '2025-09-27',
				amount: 66,
				nb_participants: 1,
				userId: users[0].id,
			},
			{
				visit_date: '2025-09-05',
				amount: 198,
				nb_participants: 3,
				userId: users[1].id,
			},
		]);

		// Créer les avis
		await Reviews.bulkCreate([
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
		]);

		console.log('✅ Données insérées avec succès');
	} catch (error) {
		console.error('❌ Erreur pendant le seed :', error);
		process.exit(1);
	}
}

seed();

export default seed;
