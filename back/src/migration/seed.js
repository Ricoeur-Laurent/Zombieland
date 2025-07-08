import {
	sequelize,
	Users,
	Attractions,
	Reviews,
	Reservations,
	Categories,
} from '../models/index.js';

async function seed() {
	try {
		await sequelize.sync({ force: true });
		console.log('BDD synchronisée');

		// Création des attractions
		const attractions = await Attractions.bulkCreate([
			{
				name: 'Le Dedale Maudit',
				image: 'Dedale.jpg',
				description: 'Labyrinthe flippant',
			},
			{
				name: 'Le Manoir des Ames Perdues',
				image: 'Manoir.jpg',
				description: 'Manoir hanté qui fait peur',
			},
		]);

		// Création des catégories
		const categories = await Categories.bulkCreate([
			{ name: 'Survival' },
			{ name: 'Escape Game' },
		]);

		// Association de chaque attraction à sa catégorie
		await attractions[0].addCategories([categories[0]]);
		await attractions[1].addCategories([categories[1]]);

		// Création des users
		const users = await Users.bulkCreate([
			{
				firstname: 'Zombie1',
				lastname: 'Zombie1',
				email: 'zombie1@hell.com',
				password: 666,
				phone: '0666666666',
				admin: true,
			},
			{
				firstname: 'Zombie2',
				lastname: 'Zombie2',
				email: 'zombie2@hell.com',
				password: 999,
				phone: '0999999999',
				admin: false,
			},
		]);

		// Création des réservations liées à un user
		const reservations = await Reservations.bulkCreate([
			{
				visit_date: '2025-12-25',
				amount: 66.66,
				nb_participants: 1,
				userId: users[0].id,
			},
			{
				visit_date: '2026-01-01',
				amount: 133.32,
				nb_participants: 2,
				userId: users[1].id,
			},
		]);

		// Création des reviews liées à un user + une attraction
		const reviews = await Reviews.bulkCreate([
			{
				rating: 5,
				comment: 'Super attraction !!!',
				userId: users[0].id,
				attractionId: attractions[0].id,
			},
			{
				rating: 5,
				comment: 'Une expérience inoubliable !',
				userId: users[1].id,
				attractionId: attractions[1].id,
			},
		]);

		console.log('Données insérées avec succès');

		process.exit();
	} catch (error) {
		console.error('Erreur pendant le seed :', error);
		process.exit(1);
	}
}

seed();
