import { Reservations } from '../models/reservations.js';

const reservationsControllers = {
	async getAllReservations(req, res) {
		try {
			const reservations = await Reservations.findAll();

			res.json(reservations);
		} catch (error) {
			console.error(
				'Erreur lors de la récupération des réservations :',
				error,
			);
			res.status(500).json({
				error: 'Erreur serveur lors de la récupération des réservations.',
			});
		}
	},

	async reservationsCreate(req, res) {
		try {
			const { visit_date, nb_participants, amount, user_id } = req.body;
			if (!visit_date || !nb_participants || !amount) {
				return res
					.status(400)
					.json({ error: 'Tous les champs sont requis.' });
			}
			const reservation = await Reservations.create({
				visit_date,
				nb_participants,
				amount,
				userId: user_id,
			});
			return res
				.status(201)
				.json({
					message: 'Réservation créée avec succès.',
					reservation,
				});
		} catch (error) {
			console.error(
				'Erreur lors de la création de la réservation :',
				error,
			);
			res.status(500).json({
				error: 'Erreur serveur lors de la création de la réservation.',
			});
		}
	},
};

export default reservationsControllers;
