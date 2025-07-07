import { Reservations } from '../models/reservations.js';

const reservationsControllers = {
	async getAllReservations(req, res) {
		try {
			const reservations = await Reservations.findAll();

			res.json(reservations);
		} catch (error) {
			console.error('Erreur lors de la récupération des réservations :', error);
			res.status(500).json({
				error: 'Erreur serveur lors de la récupération des réservations.',
			});
		}
	},

	// retrieve one reservation by id
	async getOneReservation(req, res) {
		const { id } = req.params;
		try {
			const oneReservation = await Reservations.findByPk(id);
			if (!oneReservation) {
				console.log(`La reservation n°${id} est introuvable`);
				return res.status(404).json({ message: `La reservation n°${id} est introuvable` });
			}
			res.json(oneReservation);
		} catch (error) {
			console.error(`Erreur lors de la récupération de la réservation n° ${id} `, error);
			res
				.status(500)
				.json({
					message: `Erreur serveur interne lors de la récupération de la réservation n° ${id}`,
				});
		}
	},

	async reservationsCreate(req, res) {
		try {
			const { visit_date, nb_participants, amount, user_id } = req.body;
			if (!visit_date || !nb_participants || !amount) {
				return res.status(400).json({ error: 'Tous les champs sont requis.' });
			}
			const reservation = await Reservations.create({
				visit_date,
				nb_participants,
				amount,
				userId: user_id,
			});
			return res.status(201).json({
				message: 'Réservation créée avec succès.',
				reservation,
			});
		} catch (error) {
			console.error('Erreur lors de la création de la réservation :', error);
			res.status(500).json({
				error: 'Erreur serveur lors de la création de la réservation.',
			});
		}
	},
};

export default reservationsControllers;
